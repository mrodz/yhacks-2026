package ivygate.demo.dto;

import java.time.Instant;

public record ContractUploadResponse(
        Long id,
        String filename,
        Instant createdAt
) {}
