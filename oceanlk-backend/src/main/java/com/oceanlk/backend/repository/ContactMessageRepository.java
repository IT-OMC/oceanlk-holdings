package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.ContactMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends MongoRepository<ContactMessage, String> {

    List<ContactMessage> findAllByOrderBySubmittedDateDesc();

    List<ContactMessage> findByIsReadOrderBySubmittedDateDesc(Boolean isRead);

    long countByIsRead(Boolean isRead);
}
