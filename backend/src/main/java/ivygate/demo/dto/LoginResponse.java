package ivygate.demo.dto;

public record LoginResponse(
        String accessToken,
        String idToken,
        String refreshToken
) {}
