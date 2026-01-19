package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.NewsUpdate;
import com.oceanlk.backend.repository.NewsUpdateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/updates")
@CrossOrigin(origins = "*")
public class NewsUpdateController {

    @Autowired
    private NewsUpdateRepository newsUpdateRepository;

    @GetMapping
    public List<NewsUpdate> getAllUpdates() {
        return newsUpdateRepository.findAll();
    }
}
