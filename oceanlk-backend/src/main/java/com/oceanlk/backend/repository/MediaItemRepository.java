package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.MediaItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaItemRepository extends MongoRepository<MediaItem, String> {

    List<MediaItem> findByStatus(String status);

    List<MediaItem> findByCategory(String category);

    List<MediaItem> findByCategoryAndStatusOrderByPublishedDateDesc(String category, String status);

    List<MediaItem> findByFeaturedTrue();

    List<MediaItem> findByStatusOrderByPublishedDateDesc(String status);

    List<MediaItem> findByTitle(String title);
}
