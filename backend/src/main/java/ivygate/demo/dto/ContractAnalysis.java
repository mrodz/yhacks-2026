package ivygate.demo.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ContractAnalysis(
        DocumentSummary documentSummary,
        Eta eta,
        Step0 step0,
        List<Step> steps,
        List<UnanchoredNote> unanchoredNotes
) {

    public record DocumentSummary(
            String title,
            String documentType,
            String shortDescription
    ) {}

    public record Eta(
            int minutes,
            String basis
    ) {}

    public record Step0(
            String title,
            String description,
            List<String> items,
            String confidence // "high" | "medium" | "low"
    ) {}

    public record Step(
            int stepNumber,
            String type, // "field" | "signature" | "checkbox" | "warning" | "note" | "review" | "info"
            String title,
            String description,
            List<String> targetElementIds,
            int pageHint,
            int readingOrderHint,
            String confidence
    ) {}

    public record UnanchoredNote(
            String title,
            String description,
            String reason
    ) {}
}