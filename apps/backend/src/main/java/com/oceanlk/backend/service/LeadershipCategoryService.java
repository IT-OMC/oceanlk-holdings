package com.oceanlk.backend.service;

import com.oceanlk.backend.model.LeadershipCategory;
import com.oceanlk.backend.repository.LeadershipCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeadershipCategoryService {

    @Autowired
    private LeadershipCategoryRepository leadershipCategoryRepository;

    public List<LeadershipCategory> getAllCategories() {
        return leadershipCategoryRepository.findAll();
    }

    public Optional<LeadershipCategory> getCategoryById(String id) {
        return leadershipCategoryRepository.findById(id);
    }

    public LeadershipCategory createCategory(LeadershipCategory category) {
        return leadershipCategoryRepository.save(category);
    }

    public LeadershipCategory updateCategory(String id, LeadershipCategory categoryDetails) {
        LeadershipCategory category = leadershipCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        category.setCode(categoryDetails.getCode());
        category.setTitle(categoryDetails.getTitle());
        category.setSubtitle(categoryDetails.getSubtitle());
        category.setDisplayOrder(categoryDetails.getDisplayOrder());

        return leadershipCategoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        leadershipCategoryRepository.deleteById(id);
    }
}
