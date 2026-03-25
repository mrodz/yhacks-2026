package ivygate.demo.exception;

public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException() {
        super(String.format("An account already exists with this email"));
    }
}