package com.oceanlk.backend.service;

import com.oceanlk.backend.model.Testimonial;
import com.oceanlk.backend.repository.TestimonialRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TestimonialServiceTest {

    @Mock
    private TestimonialRepository testimonialRepository;

    @InjectMocks
    private TestimonialService testimonialService;

    private Testimonial testTestimonial;

    @BeforeEach
    void setUp() {
        testTestimonial = new Testimonial();
        testTestimonial.setId(1);
        testTestimonial.setName("John Doe");
        testTestimonial.setPosition("CEO");
        testTestimonial.setCompany("Test Corp");
        testTestimonial.setQuote("Great service!");
        testTestimonial.setRating(5);
    }

    @Test
    void getAllTestimonials_ShouldReturnAllTestimonials() {
        // Arrange
        List<Testimonial> testimonials = Arrays.asList(testTestimonial, new Testimonial());
        when(testimonialRepository.findAll()).thenReturn(testimonials);

        // Act
        List<Testimonial> result = testimonialService.getAllTestimonials();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(testimonialRepository, times(1)).findAll();
    }

    @Test
    void getTestimonialById_ShouldReturnTestimonial_WhenExists() {
        // Arrange
        when(testimonialRepository.findById(1)).thenReturn(Optional.of(testTestimonial));

        // Act
        Optional<Testimonial> result = testimonialService.getTestimonialById(1);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("John Doe", result.get().getName());
        verify(testimonialRepository, times(1)).findById(1);
    }

    @Test
    void createTestimonial_ShouldSaveTestimonial() {
        // Arrange
        when(testimonialRepository.save(testTestimonial)).thenReturn(testTestimonial);

        // Act
        Testimonial result = testimonialService.createTestimonial(testTestimonial);

        // Assert
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        verify(testimonialRepository, times(1)).save(testTestimonial);
    }

    @Test
    void updateTestimonial_ShouldUpdateTestimonial() {
        // Arrange
        Testimonial updates = new Testimonial();
        updates.setName("Jane Doe");
        when(testimonialRepository.findById(1)).thenReturn(Optional.of(testTestimonial));
        when(testimonialRepository.save(any(Testimonial.class))).thenReturn(testTestimonial);

        // Act
        Testimonial result = testimonialService.updateTestimonial(1, updates);

        // Assert
        assertNotNull(result);
        verify(testimonialRepository, times(1)).save(testTestimonial);
    }

    @Test
    void deleteTestimonial_ShouldCallRepository() {
        // Arrange
        doNothing().when(testimonialRepository).deleteById(1);

        // Act
        testimonialService.deleteTestimonial(1);

        // Assert
        verify(testimonialRepository, times(1)).deleteById(1);
    }
}
