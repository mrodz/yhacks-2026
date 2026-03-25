package ivygate.demo.exception;

public class SchoolNotFoundException extends RuntimeException {
    public SchoolNotFoundException(String name) {
        super(String.format("This school is not supported on ivygate: %s", name));
    }

    public SchoolNotFoundException(Long id) {
        super(String.format("This school is not supported on ivygate: %d", id));
    }
}