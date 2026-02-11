package com.oceanlk.backend.service;

import com.oceanlk.backend.dto.SearchDTO;
import com.oceanlk.backend.model.*;
import com.oceanlk.backend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SearchServiceTest {

    @Mock
    private CompanyRepository companyRepository;
    @Mock
    private JobOpportunityRepository jobOpportunityRepository;
    @Mock
    private MediaItemRepository mediaItemRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private TestimonialRepository testimonialRepository;
    @Mock
    private PartnerRepository partnerRepository;
    @Mock
    private CorporateLeaderRepository corporateLeaderRepository;

    @InjectMocks
    private SearchService searchService;

    @Test
    void search_ShouldReturnEmpty_WhenQueryIsEmpty() {
        SearchDTO.SearchResponse response = searchService.search("");
        assertEquals(0, response.getTotalResults());
        assertTrue(response.getResults().isEmpty());
    }

    @Test
    void search_ShouldReturnResults_WhenMatchesFound() {
        // Arrange
        Company company = new Company();
        company.setId("c1");
        company.setTitle("Tech Corp");
        company.setDescription("A tech company");

        JobOpportunity job = new JobOpportunity();
        job.setId("j1");
        job.setTitle("Tech Lead");
        job.setDescription("Lead the tech team");

        Event event = new Event();
        event.setId("e1");
        event.setTitle("Tech Conference");
        event.setDescription("Annual tech meetup");

        when(companyRepository.findAll()).thenReturn(Arrays.asList(company));
        when(jobOpportunityRepository.findAll()).thenReturn(Arrays.asList(job));
        when(eventRepository.findAll()).thenReturn(Arrays.asList(event));
        when(mediaItemRepository.findAll()).thenReturn(Collections.emptyList());
        when(testimonialRepository.findAll()).thenReturn(Collections.emptyList());
        when(partnerRepository.findAll()).thenReturn(Collections.emptyList());
        when(corporateLeaderRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        SearchDTO.SearchResponse response = searchService.search("tech");

        // Assert
        assertEquals(3, response.getTotalResults());
        assertTrue(response.getResults().containsKey("companies"));
        assertTrue(response.getResults().containsKey("jobs"));
        assertTrue(response.getResults().containsKey("events"));
    }

    @Test
    void search_ShouldFilterResults_BasedOnQuery() {
        // Arrange
        Company c1 = new Company();
        c1.setTitle("Apple");
        c1.setDescription("Fruit");
        Company c2 = new Company();
        c2.setTitle("Banana");
        c2.setDescription("Yellow fruit");

        when(companyRepository.findAll()).thenReturn(Arrays.asList(c1, c2));
        when(jobOpportunityRepository.findAll()).thenReturn(Collections.emptyList());
        when(mediaItemRepository.findAll()).thenReturn(Collections.emptyList());
        when(eventRepository.findAll()).thenReturn(Collections.emptyList());
        when(testimonialRepository.findAll()).thenReturn(Collections.emptyList());
        when(partnerRepository.findAll()).thenReturn(Collections.emptyList());
        when(corporateLeaderRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        SearchDTO.SearchResponse response = searchService.search("apple");

        // Assert
        assertEquals(1, response.getTotalResults());
        assertEquals("Apple", response.getResults().get("companies").get(0).getTitle());
    }

    @Test
    void search_ShouldLimitResults() {
        // Arrange
        Company c1 = new Company();
        c1.setTitle("Test 1");
        Company c2 = new Company();
        c2.setTitle("Test 2");
        Company c3 = new Company();
        c3.setTitle("Test 3");
        Company c4 = new Company();
        c4.setTitle("Test 4");
        Company c5 = new Company();
        c5.setTitle("Test 5");
        Company c6 = new Company();
        c6.setTitle("Test 6");

        when(companyRepository.findAll()).thenReturn(Arrays.asList(c1, c2, c3, c4, c5, c6));
        when(jobOpportunityRepository.findAll()).thenReturn(Collections.emptyList());
        when(mediaItemRepository.findAll()).thenReturn(Collections.emptyList());
        when(eventRepository.findAll()).thenReturn(Collections.emptyList());
        when(testimonialRepository.findAll()).thenReturn(Collections.emptyList());
        when(partnerRepository.findAll()).thenReturn(Collections.emptyList());
        when(corporateLeaderRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        SearchDTO.SearchResponse response = searchService.search("test");

        // Assert
        // Logic limits to 5 per category
        assertEquals(5, response.getResults().get("companies").size());
    }
}
