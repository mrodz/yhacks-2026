package ivygate.demo.service.processor;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class LavaService extends Processor {

    private static final String MODEL = "gpt-4o-mini";
    private static final String OPENAI_CHAT_COMPLETIONS_URL = "https://api.openai.com/v1/chat/completions";

    private final RestClient restClient;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public LavaService(
            @Value("${lava.secret-key}") String lavaSecretKey
    ) {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.lava.so/v1")
                .defaultHeader("Authorization", "Bearer " + lavaSecretKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    /**
     * Sends a chat completion request through Lava and deserializes the JSON
     * response content into the given type.
     *
     * @param systemPrompt instructions that shape the model's behaviour and
     * output format
     * @param userPrompt the user message (the actual content to process)
     * @param responseType the record / class to deserialize the JSON content
     * into
     */
    @Override
    public <T> T complete(String systemPrompt, String userPrompt, Class<T> responseType) {
        Map<String, Object> body = Map.of(
                "model", MODEL,
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userPrompt)
                )
        );

        String uri = UriComponentsBuilder.fromPath("/forward")
                .queryParam("u", OPENAI_CHAT_COMPLETIONS_URL)
                .build()
                .toUriString();

        ChatResponse response = restClient.post()
                .uri(uri)
                .body(body)
                .retrieve()
                .body(ChatResponse.class);

        if (response == null || response.choices() == null || response.choices().isEmpty()) {
            throw new RuntimeException("Lava returned an empty response");
        }

        try {
            String content = response.choices().get(0).message().content();
            return objectMapper.readValue(content, responseType);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize GPT response", e);
        }
    }

    @Override
    public PromptIteration getPrompt() {
        return PromptIteration.LATEST;
    }

    // ── Provider response shape ──────────────────────────────────────────────
    private record ChatResponse(List<Choice> choices) {}

    private record Choice(Message message) {}

    private record Message(String role, String content) {}
}
