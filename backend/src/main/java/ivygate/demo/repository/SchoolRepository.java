package ivygate.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import ivygate.demo.model.School;

public interface SchoolRepository extends JpaRepository<School, Long> {
    @Query(value = """
        SELECT * FROM schools s
        WHERE :domain = s.domain
        OR :domain LIKE '%.' || s.domain
        LIMIT 1
    """, nativeQuery = true)
    Optional<School> findByEmailDomain(String domain);
}