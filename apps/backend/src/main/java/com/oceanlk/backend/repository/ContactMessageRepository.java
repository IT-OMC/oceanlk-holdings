package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, String> {

    List<ContactMessage> findAllByOrderBySubmittedDateDesc();

    List<ContactMessage> findByIsReadOrderBySubmittedDateDesc(Boolean isRead);

    long countByIsRead(Boolean isRead);
}
