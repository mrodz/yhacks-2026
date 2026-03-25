package ivygate.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import ivygate.demo.dto.SchoolResponse;
import ivygate.demo.model.School;
import ivygate.demo.repository.SchoolRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;

@Service
@Validated
@RequiredArgsConstructor
public class SchoolService {
    private final SchoolRepository schoolRepository;

    public List<SchoolResponse> getAllSchools() {
        return schoolRepository.findAll()
                .stream()
                .map(s -> new SchoolResponse(s.getId(), s.getCode(), s.getName(), s.getDomain()))
                .toList();
    }

    public SchoolResponse getSchoolById(Long id) {
        var school = schoolRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("School not found"));

        return new SchoolResponse(school.getId(), school.getCode(), school.getName(), school.getDomain());
    }

    public Optional<School> getSchoolByEmail(@Email String email) {
        var domain = email.substring(email.indexOf('@') + 1);
        return schoolRepository.findByEmailDomain(domain);
    }
}