package ivygate.demo.dto;

public record UserResponse(
        Long id,
        String name,
        String email,
        String language,
        Long schoolId,
        String schoolCode,
        String schoolName
) {}