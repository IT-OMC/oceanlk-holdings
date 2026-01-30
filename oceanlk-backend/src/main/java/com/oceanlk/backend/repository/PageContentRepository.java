package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.PageContent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageContentRepository extends MongoRepository<PageContent, String> {
    Optional<PageContent> findByPageIdentifierAndSectionIdentifier(String pageIdentifier, String sectionIdentifier);

    List<PageContent> findByPageIdentifier(String pageIdentifier);
}
