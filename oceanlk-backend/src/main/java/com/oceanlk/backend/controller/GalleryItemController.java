package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.GalleryItem;
import com.oceanlk.backend.repository.GalleryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "*")
public class GalleryItemController {

    @Autowired
    private GalleryItemRepository galleryItemRepository;

    @GetMapping
    public List<GalleryItem> getAllGalleryItems() {
        return galleryItemRepository.findAll();
    }
}
