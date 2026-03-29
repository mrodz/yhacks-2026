package ivygate.demo.dto;

import jakarta.validation.constraints.NotBlank;

public record QuestionRequest(
        @NotBlank String question
) {}
