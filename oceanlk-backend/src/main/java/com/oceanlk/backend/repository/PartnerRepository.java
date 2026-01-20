package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.Partner;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartnerRepository extends MongoRepository<Partner, String> {
    List<Partner> findAllByOrderByDisplayOrderAsc();

    List<Partner> findByCategoryOrderByDisplayOrderAsc(String category);
}
