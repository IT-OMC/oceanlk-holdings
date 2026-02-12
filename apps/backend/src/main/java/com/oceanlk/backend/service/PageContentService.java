package com.oceanlk.backend.service;

import com.oceanlk.backend.model.PageContent;
import com.oceanlk.backend.repository.PageContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PageContentService {

    @Autowired
    private PageContentRepository pageContentRepository;

    public List<PageContent> getAllPageContent() {
        return pageContentRepository.findAll();
    }

    public Optional<PageContent> getContentByPageAndSection(String page, String section) {
        return pageContentRepository.findByPageIdentifierAndSectionIdentifier(page, section);
    }

    public Optional<PageContent> getContentById(String id) {
        return pageContentRepository.findById(id);
    }

    public PageContent createOrUpdateContent(PageContent pageContent) {
        // Check if content already exists for this page and section
        Optional<PageContent> existing = pageContentRepository.findByPageIdentifierAndSectionIdentifier(
                pageContent.getPageIdentifier(), pageContent.getSectionIdentifier());

        if (existing.isPresent()) {
            // Update existing
            PageContent existingContent = existing.get();
            existingContent.setTitle(pageContent.getTitle());
            existingContent.setSubtitle(pageContent.getSubtitle());
            existingContent.setContent(pageContent.getContent());
            existingContent.setImageUrl(pageContent.getImageUrl());
            existingContent.setCtaText(pageContent.getCtaText());
            existingContent.setCtaLink(pageContent.getCtaLink());
            return pageContentRepository.save(existingContent);
        } else {
            // Create new
            return pageContentRepository.save(pageContent);
        }
    }

    public void deleteContent(String id) {
        pageContentRepository.deleteById(id);
    }
}
