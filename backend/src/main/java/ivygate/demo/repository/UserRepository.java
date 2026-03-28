package ivygate.demo.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import ivygate.demo.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByPersonalEmail(String personalEmail);
    boolean existsByEmailAndIdNot(String email, Long id);
    Optional<User> findBySub(UUID sub);
}