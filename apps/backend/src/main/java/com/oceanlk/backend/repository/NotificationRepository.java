package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByRecipientRoleAndIsReadFalseOrderByCreatedAtDesc(String recipientRole);

    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(String recipientId);

    List<Notification> findByRecipientRoleOrderByCreatedAtDesc(String recipientRole);
}
