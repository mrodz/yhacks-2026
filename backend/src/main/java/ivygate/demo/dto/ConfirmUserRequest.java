package ivygate.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ConfirmUserRequest(
        @NotBlank @Email String email,
        @NotBlank String code
) {}
