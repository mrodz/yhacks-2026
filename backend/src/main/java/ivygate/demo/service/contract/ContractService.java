package ivygate.demo.service.contract;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import ivygate.demo.dto.ContractAnalysis;
import ivygate.demo.dto.ContractParseResponse;
import ivygate.demo.dto.ContractUploadResponse;
import ivygate.demo.model.AnalysisResult;
import ivygate.demo.model.ContractUpload;
import ivygate.demo.model.User;
import ivygate.demo.repository.AnalysisResultRepository;
import ivygate.demo.repository.ContractUploadRepository;
import ivygate.demo.repository.UserRepository;
import ivygate.demo.service.ChatGptService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.textract.TextractClient;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ChatGptService chatGptService;
    private final TextractClient textractClient;
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final UserRepository userRepository;
    private final ContractUploadRepository contractUploadRepository;
    private final AnalysisResultRepository analysisResultRepository;
    private static final ObjectMapper objectMapper;

    @Value("${aws.s3.bucket}")
    private String bucket;

    static {
        objectMapper = new ObjectMapper();
    }

    public ContractParseResponse parse(MultipartFile file, UUID sub) throws IOException {
        User user = userRepository.findBySub(sub)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.pdf";
        String base = String.format("uploads/%s/%s", sub, UUID.randomUUID());
        String pdfKey = base + ".pdf";
        String parsedKey = base + ".json";

        ContractParser parser = new ContractParser(textractClient, s3Client, bucket);
        List<List<WordBlock>> lines = parser.extractLines(file.getInputStream(), pdfKey);

        // Build a slim block list (id + text + page) so GPT can reference real element IDs
        List<Map<String, Object>> slimBlocks = lines.stream()
                .flatMap(List::stream)
                .map(w -> {
                    Map<String, Object> m = new java.util.LinkedHashMap<>();
                    m.put("id", w.id());
                    m.put("text", w.text() != null ? w.text() : "");
                    m.put("page", w.page());
                    return m;
                })
                .collect(Collectors.toList());
                
        StringBuilder csv = new StringBuilder();

        csv.append("id,text,page\n"); // header

        for (Map<String, Object> row : slimBlocks) {
            String id = String.valueOf(row.get("id"));
            String text = String.valueOf(row.get("text")).replace("\"", "\"\""); // escape quotes
            String page = String.valueOf(row.get("page"));

            csv.append(id)
            .append(",\"").append(text).append("\"") // wrap text in quotes (important)
            .append(",")
            .append(page)
            .append("\n");
        }

        String blockCsv = csv.toString();

        ContractAnalysis analysis = chatGptService.analyzeContract(blockCsv);

        byte[] json = objectMapper.writeValueAsBytes(lines);
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucket)
                        .key(parsedKey)
                        .contentType("application/json")
                        .build(),
                RequestBody.fromBytes(json)
        );

        ContractUpload saved = contractUploadRepository.save(ContractUpload.builder()
                .user(user)
                .filename(filename)
                .s3Key(pdfKey)
                .parsedS3Key(parsedKey)
                .createdAt(Instant.now())
                .build());

        analysisResultRepository.save(AnalysisResult.builder()
                .upload(saved)
                .analysis(analysis)
                .createdAt(Instant.now())
                .build());

        return new ContractParseResponse(saved.getId(), filename, lines, analysis);
    }

    public List<List<WordBlock>> getParsed(Long uploadId, UUID sub) throws IOException {
        User user = userRepository.findBySub(sub)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        ContractUpload upload = contractUploadRepository.findByIdAndUser(uploadId, user)
                .orElseThrow(() -> new EntityNotFoundException("Upload not found"));

        byte[] bytes = s3Client.getObjectAsBytes(
                GetObjectRequest.builder().bucket(bucket).key(upload.getParsedS3Key()).build()
        ).asByteArray();

        return objectMapper.readValue(bytes,
                objectMapper.getTypeFactory().constructCollectionType(List.class,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, WordBlock.class)));
    }

    public ContractAnalysis getAnalysis(Long uploadId, UUID sub) {
        User user = userRepository.findBySub(sub)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        ContractUpload upload = contractUploadRepository.findByIdAndUser(uploadId, user)
                .orElseThrow(() -> new EntityNotFoundException("Upload not found"));
        AnalysisResult result = analysisResultRepository.findByUpload(upload)
                .orElseThrow(() -> new EntityNotFoundException("Analysis not found"));

        return result.getAnalysis();
    }

    public List<ContractUploadResponse> listUploads(UUID sub) {
        User user = userRepository.findBySub(sub)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return contractUploadRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(u -> new ContractUploadResponse(u.getId(), u.getFilename(), u.getCreatedAt()))
                .toList();
    }

    public byte[] downloadPdf(Long uploadId, UUID sub) {
        User user = userRepository.findBySub(sub)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        ContractUpload upload = contractUploadRepository.findByIdAndUser(uploadId, user)
                .orElseThrow(() -> new EntityNotFoundException("Upload not found"));

        return s3Client.getObjectAsBytes(
                GetObjectRequest.builder().bucket(bucket).key(upload.getS3Key()).build()
        ).asByteArray();
    }

    public String presignedUrl(Long uploadId, UUID sub) {
        User user = userRepository.findBySub(sub)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        ContractUpload upload = contractUploadRepository.findByIdAndUser(uploadId, user)
                .orElseThrow(() -> new EntityNotFoundException("Upload not found"));

        PresignedGetObjectRequest presigned = s3Presigner.presignGetObject(r -> r
                .signatureDuration(Duration.ofMinutes(15))
                .getObjectRequest(req -> req.bucket(bucket).key(upload.getS3Key())));

        return presigned.url().toString();
    }
}
