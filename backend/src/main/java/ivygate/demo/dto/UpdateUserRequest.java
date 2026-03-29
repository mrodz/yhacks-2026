package ivygate.demo.dto;

import jakarta.validation.constraints.Email;

public record UpdateUserRequest(
        String name,
        @Email String email,
        @Email String personalEmail,
        String language,
        Long schoolId
) {}