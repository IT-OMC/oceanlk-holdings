package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.Testimonial;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestimonialRepository extends MongoRepository<Testimonial, Integer> {
}
