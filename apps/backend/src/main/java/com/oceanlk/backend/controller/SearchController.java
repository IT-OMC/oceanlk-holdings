package com.oceanlk.backend.controller;

import com.oceanlk.backend.dto.SearchDTO;
import com.oceanlk.backend.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:4173" })
public class SearchController {

    private final SearchService searchService;

    @PostMapping
    public ResponseEntity<SearchDTO.SearchResponse> search(@RequestBody SearchDTO.SearchRequest request) {
        if (request.getQuery() == null || request.getQuery().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new SearchDTO.SearchResponse(request.getQuery(), null, 0));
        }

        SearchDTO.SearchResponse response = searchService.search(request.getQuery());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<SearchDTO.SearchResponse> searchByParam(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    new SearchDTO.SearchResponse(q, null, 0));
        }

        SearchDTO.SearchResponse response = searchService.search(q);
        return ResponseEntity.ok(response);
    }
}
