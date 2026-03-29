package ivygate.demo.dto;

import java.util.List;

import ivygate.demo.service.contract.WordBlock;

public record ContractParseResponse(
        Long uploadId,
        String filename,
        List<List<WordBlock>> lines,
        ContractAnalysis analysis
) {}
