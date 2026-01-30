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
        companyRepository.deleteById(id);
    }
}
