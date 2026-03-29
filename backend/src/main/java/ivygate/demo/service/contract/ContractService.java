package ivygate.demo.service.contract;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.textract.TextractClient;

@Service
public class ContractService {

    private final ContractParser contractParser;

    public ContractService(
            TextractClient textractClient,
            S3Client s3Client,
            @Value("${aws.s3.bucket}") String bucket
    ) {
        this.contractParser = new ContractParser(textractClient, s3Client, bucket);
    }

    /**
     * Parses a PDF and returns all words grouped into lines.
     * Each inner list is one line, words sorted left-to-right.
     */
    public List<WordBlock> parse(MultipartFile file, String sub) throws IOException {
        return contractParser.extractWords(file.getInputStream(), sub);
    }
}