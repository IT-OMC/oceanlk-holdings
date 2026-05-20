package com.oceanlk.backend.repository;

import com.oceanlk.backend.model.PageContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageContentRepository extends JpaRepository<PageContent, String> {
    Optional<PageContent> findByPageIdentifierAndSectionIdentifier(String pageIdentifier, String sectionIdentifier);

    List<PageContent> findByPageIdentifier(String pageIdentifier);
}
