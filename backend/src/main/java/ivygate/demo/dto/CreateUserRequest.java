package ivygate.demo.dto;

import java.util.Optional;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateUserRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        Optional<@Email String> personalEmail
) {}