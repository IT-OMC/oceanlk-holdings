package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.WhatsAppConfig;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WhatsAppRepository extends MongoRepository<WhatsAppConfig, String> {
    Optional<WhatsAppConfig> findFirstBy();
}
