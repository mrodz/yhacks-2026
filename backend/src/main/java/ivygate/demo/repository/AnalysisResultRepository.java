package ivygate.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ivygate.demo.model.AnalysisResult;
import ivygate.demo.model.ContractUpload;

public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {
    Optional<AnalysisResult> findByUpload(ContractUpload upload);
}
