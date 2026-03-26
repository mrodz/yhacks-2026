package ivygate.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import ivygate.demo.dto.ConfirmUserRequest;
import ivygate.demo.dto.CreateUserRequest;
import ivygate.demo.dto.UpdateUserRequest;
import ivygate.demo.dto.UserResponse;
import ivygate.demo.exception.DuplicateUserException;
import ivygate.demo.exception.SchoolNotFoundException;
import ivygate.demo.model.School;
import ivygate.demo.model.User;
import ivygate.demo.repository.SchoolRepository;
import ivygate.demo.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final CognitoService cognitoService;

    /**
     * Validates the school domain and initiates Cognito sign-up.
     * Cognito sends a 6-digit code to the user's email from no-reply@verificationemail.com.
     */
    public void initiateRegistration(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email()) || request.personalEmail().map(userRepository::existsByPersonalEmail).orElse(false)) {
            throw new DuplicateUserException();
        }

        var emailDomain = request.email().substring(request.email().indexOf("@") + 1);
        schoolRepository.findByEmailDomain(emailDomain)
                .orElseThrow(() -> new SchoolNotFoundException(request.email()));

        cognitoService.signUp(request.email(), request.name(), request.password());
    }

    /**
     * Confirms the verification code with Cognito and saves the user to the database.
     */
    public UserResponse confirmRegistration(ConfirmUserRequest request) {
        var signupResult = cognitoService.confirmSignUp(request.email(), request.code());

        var emailDomain = request.email().substring(request.email().indexOf("@") + 1);
        School school = schoolRepository.findByEmailDomain(emailDomain)
                .orElseThrow(() -> new SchoolNotFoundException(request.email()));

        User user = User.builder()
                .email(request.email())
                .sub(signupResult.sub())
                .name(signupResult.name())
                .school(school)
                .build();

        return toResponse(userRepository.save(user));
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return toResponse(user);
    }

    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (request.email() != null && userRepository.existsByEmailAndIdNot(request.email(), id)) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (request.name() != null) {
            user.setName(request.name());
        }

        if (request.email() != null) {
            user.setEmail(request.email());
        }

        if (request.schoolId() != null) {
            School school = schoolRepository.findById(request.schoolId())
                    .orElseThrow(() -> new SchoolNotFoundException(request.schoolId()));
            user.setSchool(school);
        }

        User updated = userRepository.save(user);
        return toResponse(updated);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getSchool().getId(),
                user.getSchool().getCode(),
                user.getSchool().getName()
        );
    }
}
