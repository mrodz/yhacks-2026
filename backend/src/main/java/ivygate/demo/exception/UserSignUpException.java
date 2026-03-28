package ivygate.demo.exception;

import software.amazon.awssdk.services.cognitoidentityprovider.model.InvalidParameterException;

public class UserSignUpException extends RuntimeException {
    public static enum PolicyViolation {
        PHONE_NUMBER_FORMAT("A phone number must start with a plus (+) sign, followed immediately by the country code. For example, a phone number based in the United States must follow this format: +14325551212");

        public final String message;

        PolicyViolation(String message) {
            this.message = message;
        }
    }

    public static UserSignUpException fromInvalidParameterException(InvalidParameterException e) {
        var message = e.getMessage();

        if (message.contains("phone number")) {
            return new UserSignUpException(PolicyViolation.PHONE_NUMBER_FORMAT);
        } else {
            return new UserSignUpException(e);
        }
    }

    public UserSignUpException(PolicyViolation reason) {
        super(reason.message);
    }

    public UserSignUpException(Exception e) {
        var title = String.format("Could not create user: %s (%s)", e.getMessage(), e.getClass().getName());
        super(title, e);
    }
}