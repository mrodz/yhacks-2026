package ivygate.demo.service;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import ivygate.demo.exception.DuplicateUserException;
import ivygate.demo.exception.InvalidVerificationCodeException;
import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AdminGetUserRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.AttributeType;
import software.amazon.awssdk.services.cognitoidentityprovider.model.CodeMismatchException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ConfirmSignUpRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.ExpiredCodeException;
import software.amazon.awssdk.services.cognitoidentityprovider.model.SignUpRequest;
import software.amazon.awssdk.services.cognitoidentityprovider.model.UsernameExistsException;

@Service
@RequiredArgsConstructor
public class CognitoService {

    public static record ConfirmSignUp(UUID sub, String name) {

    }

    private final CognitoIdentityProviderClient cognitoClient;

    @Value("${aws.cognito.user-pool-id}")
    private String userPoolId;

    @Value("${aws.cognito.client-id}")
    private String clientId;

    @Value("${aws.cognito.client-secret}")
    private String clientSecret;

    /**
     * Initiates sign-up. Cognito sends a 6-digit verification code to the
     * user's email from no-reply@verificationemail.com.
     */
    public void signUp(String email, String name, String password) {
        try {
            cognitoClient.signUp(SignUpRequest.builder()
                    .clientId(clientId)
                    .secretHash(secretHash(email))
                    .username(email)
                    .password(password)
                    .userAttributes(
                            AttributeType.builder().name("email").value(email).build(),
                            AttributeType.builder().name("name").value(name).build()
                    )
                    .build());
        } catch (UsernameExistsException e) {
            throw new DuplicateUserException();
        }
    }

    /**
     * Confirms sign-up with the verification code. Returns the Cognito sub
     * (UUID) for DB linking.
     */
    public ConfirmSignUp confirmSignUp(String email, String code) {
        try {
            cognitoClient.confirmSignUp(ConfirmSignUpRequest.builder()
                    .clientId(clientId)
                    .secretHash(secretHash(email))
                    .username(email)
                    .confirmationCode(code)
                    .build());
        } catch (CodeMismatchException e) {
            throw new InvalidVerificationCodeException("Verification code is incorrect.");
        } catch (ExpiredCodeException e) {
            throw new InvalidVerificationCodeException("Verification code has expired.");
        }

        Map<String, String> properties = cognitoClient.adminGetUser(AdminGetUserRequest.builder()
                .userPoolId(userPoolId)
                .username(email)
                .build())
                .userAttributes().stream()
                .filter(a -> a.name().equals("sub") || a.name().equals("name"))
                .collect(Collectors.toMap(
                        a -> a.name(),
                        a -> a.value()
                ));

        return new ConfirmSignUp(UUID.fromString(properties.get("sub")), properties.get("name"));
    }

    private String secretHash(String username) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(clientSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            mac.update(username.getBytes(StandardCharsets.UTF_8));
            mac.update(clientId.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(mac.doFinal());
        } catch (InvalidKeyException e) {
            throw new RuntimeException("Failed to compute Cognito secret hash", e);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("HmacSHA256 should be a valid MAC algorithm", e);
        } 
    }
}
