package ivygate.demo.exception;

import software.amazon.awssdk.services.cognitoidentityprovider.model.InvalidPasswordException;

public class PasswordException extends RuntimeException {
    public static enum PolicyViolation {
        TOO_SHORT("Password minimum length is 8 character(s)"),
        TEMPORARY_PASSWORD_EXPIRED("Temporary passwords set by administrators expire in 7 day(s)"),
        REQ_1_NUMBER("Password must contain at least 1 number"),
        REQ_1_SPECIAL_CHAR("""
                Password special characters
                The following characters count as special characters:
                ^ $ * . [ ] { } ( ) ? - \" ! @ # % & / \\ , > < ' : ; | _ ~ ` + =
                The non-leading, non-trailing space character is also treated as a special character.
                """),
        REQ_1_UPPERCASE("Password must contain at least 1 uppercase letter"),
        REQ_1_LOWERCASE("Password must contain at least 1 lowercase letter");

        public final String message;

        PolicyViolation(String message) {
            this.message = message;
        }
    }

    public PasswordException(PolicyViolation reason) {
        super(reason.message);
    }

    public static PasswordException fromInvalidPasswordException(InvalidPasswordException e) {
        String message = e.getMessage();

        if (message.contains("uppercase characters")) {
            return new PasswordException(PolicyViolation.REQ_1_UPPERCASE);
        } else if (message.contains("lowercase characters")) {
            return new PasswordException(PolicyViolation.REQ_1_LOWERCASE);
        } else if (message.contains("numeric characters")) {
            return new PasswordException(PolicyViolation.REQ_1_NUMBER);
        } else if (message.contains("symbol characters")) {
            return new PasswordException(PolicyViolation.REQ_1_SPECIAL_CHAR);
        } else if (message.contains("8")) {
            return new PasswordException(PolicyViolation.TOO_SHORT);
        } else {
            throw new UserSignUpException(e);
        }
    }
}