package ivygate.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ivygate.demo.model.ContractUpload;
import ivygate.demo.model.User;

public interface ContractUploadRepository extends JpaRepository<ContractUpload, Long> {
    List<ContractUpload> findByUserOrderByCreatedAtDesc(User user);
    Optional<ContractUpload> findByIdAndUser(Long id, User user);
}
