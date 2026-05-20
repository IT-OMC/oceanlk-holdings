package com.oceanlk.backend.config;

import com.oceanlk.backend.model.MediaItem;
import com.oceanlk.backend.repository.MediaItemRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataMigrationComponent {

    private final MediaItemRepository mediaItemRepository;

    @PostConstruct
    public void migrateMediaItems() {
        List<MediaItem> items = mediaItemRepository.findAll();
        boolean changed = false;

        for (MediaItem item : items) {
            if (item.getGroup() == null) {
                // Determine group based on category
                String category = item.getCategory();
                if ("LIFE_AT_OCH".equalsIgnoreCase(category)) {
                    item.setGroup("HR_PANEL");
                } else if ("NEWS".equalsIgnoreCase(category) ||
                        "BLOG".equalsIgnoreCase(category) ||
                        "MEDIA".equalsIgnoreCase(category) ||
                        "PRESS_RELEASE".equalsIgnoreCase(category)) {
                    item.setGroup("MEDIA_PANEL");
                } else {
                    // Default for mixed categories like GALLERY/EVENTS
                    // Most existing GALLERY items are likely from Media Panel
                    item.setGroup("MEDIA_PANEL");
                }
                mediaItemRepository.save(item);
                changed = true;
            }
        }

        if (changed) {
            System.out.println("Data Migration: Updated existing MediaItems with group field.");
        }
    }
}
