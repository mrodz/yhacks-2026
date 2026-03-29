package ivygate.demo.service.processor;

import ivygate.demo.dto.ContractAnalysis;

public abstract class Processor {
    public abstract<T> T complete(String systemPrompt, String userPrompt, Class<T> responseType);
    public abstract PromptIteration getPrompt();

    /** Convenience method — analyzes contract text using the built-in system prompt. */
    public ContractAnalysis analyzeContract(String contractText, String language) {
        return complete(this.getPrompt().getPrompt(language), contractText, ContractAnalysis.class);
    }
}