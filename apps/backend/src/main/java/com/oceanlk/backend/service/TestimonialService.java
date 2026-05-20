package com.oceanlk.backend.service;

import com.oceanlk.backend.model.Testimonial;
import com.oceanlk.backend.repository.TestimonialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TestimonialService {

    @Autowired
    private TestimonialRepository testimonialRepository;

    public List<Testimonial> getAllTestimonials() {
        return testimonialRepository.findAll();
    }

    public Optional<Testimonial> getTestimonialById(Integer id) {
        return testimonialRepository.findById(id);
    }

    public Testimonial createTestimonial(Testimonial testimonial) {
        return testimonialRepository.save(testimonial);
    }

    public Testimonial updateTestimonial(Integer id, Testimonial testimonialDetails) {
        return testimonialRepository.findById(id)
                .map(testimonial -> {
                    testimonial.setName(testimonialDetails.getName());
                    testimonial.setPosition(testimonialDetails.getPosition());
                    testimonial.setCompany(testimonialDetails.getCompany());
                    testimonial.setImage(testimonialDetails.getImage());
                    testimonial.setQuote(testimonialDetails.getQuote());
                    testimonial.setRating(testimonialDetails.getRating());
                    return testimonialRepository.save(testimonial);
                })
                .orElseThrow(() -> new RuntimeException("Testimonial not found with id " + id));
    }

    public void deleteTestimonial(Integer id) {
        testimonialRepository.deleteById(id);
    }
}
