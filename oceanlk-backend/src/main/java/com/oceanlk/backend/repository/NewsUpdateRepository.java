package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.NewsUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsUpdateRepository extends MongoRepository<NewsUpdate, Integer> {
}
