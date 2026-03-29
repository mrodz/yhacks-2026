package ivygate.demo.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import ivygate.demo.dto.QuestionRequest;
import ivygate.demo.dto.QuestionResponse;

import jakarta.validation.Valid;

import ivygate.demo.dto.ContractAnalysis;
import ivygate.demo.dto.ContractParseResponse;
import ivygate.demo.dto.ContractUploadResponse;
import ivygate.demo.service.contract.ContractService;
import ivygate.demo.service.contract.WordBlock;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;

    @PostMapping(value = "/parse", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ContractParseResponse parse(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal Jwt jwt
    ) throws IOException {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must not be empty");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals(MediaType.APPLICATION_PDF_VALUE)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Only PDF files are accepted");
        }
        return contractService.parse(file, UUID.fromString(jwt.getSubject()));
    }

    @GetMapping
    public List<ContractUploadResponse> listUploads(@AuthenticationPrincipal Jwt jwt) {
        return contractService.listUploads(UUID.fromString(jwt.getSubject()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadPdf(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        byte[] bytes = contractService.downloadPdf(id, UUID.fromString(jwt.getSubject()));
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(bytes);
    }

    @GetMapping("/{id}/file")
    public Map<String, String> getPresignedUrl(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String url = contractService.presignedUrl(id, UUID.fromString(jwt.getSubject()));
        return Map.of("url", url);
    }

    @GetMapping("/{id}/parsed")
    public List<List<WordBlock>> getParsed(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) throws IOException {
        return contractService.getParsed(id, UUID.fromString(jwt.getSubject()));
    }

    @PostMapping("/{id}/ask")
    public QuestionResponse askQuestion(
            @PathVariable Long id,
            @Valid @RequestBody QuestionRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) throws IOException {
        return contractService.askQuestion(id, UUID.fromString(jwt.getSubject()), request.question());
    }

    @GetMapping("/{id}/analysis")
    public ContractAnalysis getAnalysis(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        return contractService.getAnalysis(id, UUID.fromString(jwt.getSubject()));
    }
}
