package com.oceanlk.backend.service;

import com.oceanlk.backend.dto.SearchDTO;
import com.oceanlk.backend.model.*;
import com.oceanlk.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final CompanyRepository companyRepository;
    private final JobOpportunityRepository jobOpportunityRepository;
    private final MediaItemRepository mediaItemRepository;
    private final EventRepository eventRepository;
    private final TestimonialRepository testimonialRepository;
    private final PartnerRepository partnerRepository;
    private final CorporateLeaderRepository corporateLeaderRepository;

    private static final int MAX_RESULTS_PER_CATEGORY = 5;

    public SearchDTO.SearchResponse search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new SearchDTO.SearchResponse(query, new HashMap<>(), 0);
        }

        String normalizedQuery = query.toLowerCase().trim();
        Map<String, List<SearchDTO.SearchResultItem>> categorizedResults = new LinkedHashMap<>();
        int totalResults = 0;

        // Search Companies
        List<SearchDTO.SearchResultItem> companyResults = searchCompanies(normalizedQuery);
        if (!companyResults.isEmpty()) {
            categorizedResults.put("companies", companyResults);
            totalResults += companyResults.size();
        }

        // Search Job Opportunities
        List<SearchDTO.SearchResultItem> jobResults = searchJobs(normalizedQuery);
        if (!jobResults.isEmpty()) {
            categorizedResults.put("jobs", jobResults);
            totalResults += jobResults.size();
        }

        // Search Media Items
        List<SearchDTO.SearchResultItem> mediaResults = searchMedia(normalizedQuery);
        if (!mediaResults.isEmpty()) {
            categorizedResults.put("media", mediaResults);
            totalResults += mediaResults.size();
        }

        // Search Events
        List<SearchDTO.SearchResultItem> eventResults = searchEvents(normalizedQuery);
        if (!eventResults.isEmpty()) {
            categorizedResults.put("events", eventResults);
            totalResults += eventResults.size();
        }

        // Search Testimonials
        List<SearchDTO.SearchResultItem> testimonialResults = searchTestimonials(normalizedQuery);
        if (!testimonialResults.isEmpty()) {
            categorizedResults.put("testimonials", testimonialResults);
            totalResults += testimonialResults.size();
        }

        // Search Partners
        List<SearchDTO.SearchResultItem> partnerResults = searchPartners(normalizedQuery);
        if (!partnerResults.isEmpty()) {
            categorizedResults.put("partners", partnerResults);
            totalResults += partnerResults.size();
        }

        // Search Leadership
        List<SearchDTO.SearchResultItem> leadershipResults = searchLeadership(normalizedQuery);
        if (!leadershipResults.isEmpty()) {
            categorizedResults.put("leadership", leadershipResults);
            totalResults += leadershipResults.size();
        }

        return new SearchDTO.SearchResponse(query, categorizedResults, totalResults);
    }

    private List<SearchDTO.SearchResultItem> searchCompanies(String query) {
        return companyRepository.findAll().stream()
                .filter(company -> matchesQuery(query, company.getTitle(), company.getDescription()))
                .limit(MAX_RESULTS_PER_CATEGORY)
                .map(company -> new SearchDTO.SearchResultItem(
                        "company",
                        company.getId(),
                        company.getTitle(),
                        truncate(company.getDescription(), 150),
                        "/companies/" + company.getId(),
                        company.getLogoUrl(),
                        null))
                .collect(Collectors.toList());
    }

    private List<SearchDTO.SearchResultItem> searchJobs(String query) {
        return jobOpportunityRepository.findAll().stream()
                .filter(job -> matchesQuery(query, job.getTitle(), job.getDescription()))
                .limit(MAX_RESULTS_PER_CATEGORY)
                .map(job -> new SearchDTO.SearchResultItem(
                        "job",
                        job.getId(),
                        job.getTitle(),
                        truncate(job.getDescription(), 150),
                        "/careers/" + job.getId(),
                        null,
                        job.getLocation()))
                .collect(Collectors.toList());
    }

    private List<SearchDTO.SearchResultItem> searchMedia(String query) {
        return mediaItemRepository.findAll().stream()
                .filter(media -> matchesQuery(query, media.getTitle(), media.getDescription(), media.getCategory()))
                .limit(MAX_RESULTS_PER_CATEGORY)
                .map(media -> new SearchDTO.SearchResultItem(
                        "media",
                        media.getId(),
                        media.getTitle(),
                        truncate(media.getDescription(), 150),
                        "/media/" + media.getId(),
                        media.getImageUrl() != null ? media.getImageUrl() : media.getVideoUrl(),
                        media.getCategory()))
                .collect(Collectors.toList());
    }

    private List<SearchDTO.SearchResultItem> searchEvents(String query) {
        return eventRepository.findAll().stream()
                .filter(event -> matchesQuery(query, event.getTitle(), event.getDescription(), event.getLocation()))
                .limit(MAX_RESULTS_PER_CATEGORY)
                .map(event -> new SearchDTO.SearchResultItem(
                        "event",
                        event.getId(),
                        event.getTitle(),
                        truncate(event.getDescription(), 150),
                        "/events/" + event.getId(),
                        event.getImageUrl(),
                        event.getLocation()))
                .collect(Collectors.toList());
    }

    private List<SearchDTO.SearchResultItem> searchTestimonials(String query) {
        return testimonialRepository.findAll().stream()
                .filter(testimonial -> matchesQuery(query, testimonial.getName(), testimonial.getPosition(),
                        testimonial.getQuote()))
                .limit(MAX_RESULTS_PER_CATEGORY)
                .map(testimonial -> new SearchDTO.SearchResultItem(
                        "testimonial",
                        String.valueOf(testimonial.getId()),
                        testimonial.getName(),
                        truncate(testimonial.getQuote(), 150),
                        "/testimonials",
                        null,
                        testimonial.getPosition()))
                .collect(Collectors.toList());
    }

    private List<SearchDTO.SearchResultItem> searchPartners(String query) {
        return partnerRepository.findAll().stream()
                .filter(partner -> matchesQuery(query, partner.getName()))
                .limit(MAX_RESULTS_PER_CATEGORY)
                .map(partner -> new SearchDTO.SearchResultItem(
                        "partner",
                        partner.getId(),
                        partner.getName(),
                        "",
                        "/partners",
                        partner.getLogoUrl(),
                        null))
                .collect(Collectors.toList());
    }

    private List<SearchDTO.SearchResultItem> searchLeadership(String query) {
        return corporateLeaderRepository.findAll().stream()
                .filter(leader -> matchesQuery(query, leader.getName(), leader.getPosition(), leader.getBio()))
                .limit(MAX_RESULTS_PER_CATEGORY)
                .map(leader -> new SearchDTO.SearchResultItem(
                        "leadership",
                        leader.getId(),
                        leader.getName(),
                        leader.getPosition() + (leader.getBio() != null ? " - " + truncate(leader.getBio(), 100) : ""),
                        "/leadership/" + leader.getId(),
                        leader.getImage(),
                        leader.getPosition()))
                .collect(Collectors.toList());
    }

    private boolean matchesQuery(String query, String... fields) {
        for (String field : fields) {
            if (field != null && field.toLowerCase().contains(query)) {
                return true;
            }
        }
        return false;
    }

    private String truncate(String text, int maxLength) {
        if (text == null)
            return "";
        if (text.length() <= maxLength)
            return text;
        return text.substring(0, maxLength) + "...";
    }
}
