package com.oceanlk.backend.service;

import com.oceanlk.backend.model.Company;
import com.oceanlk.backend.repository.CompanyRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    private final com.oceanlk.backend.service.FileStorageService fileStorageService;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Optional<Company> getCompanyById(String id) {
        return companyRepository.findById(id);
    }

    public Company createCompany(Company company) {
        return companyRepository.save(company);
    }

    public Company updateCompany(String id, Company companyDetails) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));

        // Delete old files if they are being replaced
        try {
            if (companyDetails.getLogoUrl() != null && !companyDetails.getLogoUrl().equals(company.getLogoUrl())
                    && company.getLogoUrl() != null) {
                fileStorageService.deleteFile(company.getLogoUrl());
            }
            if (companyDetails.getImage() != null && !companyDetails.getImage().equals(company.getImage())
                    && company.getImage() != null) {
                fileStorageService.deleteFile(company.getImage());
            }
            if (companyDetails.getVideo() != null && !companyDetails.getVideo().equals(company.getVideo())
                    && company.getVideo() != null) {
                fileStorageService.deleteFile(company.getVideo());
            }
        } catch (Exception e) {
            System.err.println("Error deleting old files during update: " + e.getMessage());
        }

        company.setTitle(companyDetails.getTitle());
        company.setDescription(companyDetails.getDescription());
        company.setLongDescription(companyDetails.getLongDescription());
        company.setLogoUrl(companyDetails.getLogoUrl());
        company.setImage(companyDetails.getImage());
        company.setVideo(companyDetails.getVideo());
        company.setEstablished(companyDetails.getEstablished());
        company.setWebsite(companyDetails.getWebsite());
        company.setIndustry(companyDetails.getIndustry());
        company.setEmployees(companyDetails.getEmployees());
        company.setRevenue(companyDetails.getRevenue());
        company.setCategory(companyDetails.getCategory());
        company.setStats(companyDetails.getStats());

        return companyRepository.save(company);
    }

    public void deleteCompany(String id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));

        // Delete associated files if they exist
        try {
            if (company.getLogoUrl() != null) {
                fileStorageService.deleteFile(company.getLogoUrl());
            }
            if (company.getImage() != null) {
                fileStorageService.deleteFile(company.getImage());
            }
            if (company.getVideo() != null) {
                fileStorageService.deleteFile(company.getVideo());
            }
        } catch (Exception e) {
            System.err.println("Error deleting company files: " + e.getMessage());
        }

        companyRepository.deleteById(id);
    }
}
