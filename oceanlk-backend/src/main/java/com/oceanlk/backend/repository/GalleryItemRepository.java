package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.GalleryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GalleryItemRepository extends MongoRepository<GalleryItem, Integer> {
}
