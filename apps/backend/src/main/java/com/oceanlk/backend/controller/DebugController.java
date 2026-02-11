package com.oceanlk.backend.controller;

import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.model.PendingChange;
import com.oceanlk.backend.repository.AdminUserRepository;
import com.oceanlk.backend.repository.PendingChangeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@RequiredArgsConstructor
public class DebugController {

    private final AdminUserRepository adminUserRepository;
    private final PendingChangeRepository pendingChangeRepository;

    @GetMapping("/check-users")
    public ResponseEntity<?> checkUsers() {
        Map<String, Object> data = new HashMap<>();
        data.put("users", adminUserRepository.findAll());
        data.put("changes", pendingChangeRepository.findAll());
        return ResponseEntity.ok(data);
    }
}
