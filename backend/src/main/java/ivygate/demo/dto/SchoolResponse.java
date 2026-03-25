package ivygate.demo.dto;

public record SchoolResponse(
        Long id,
        String code,
        String name,
        String domain
) {}