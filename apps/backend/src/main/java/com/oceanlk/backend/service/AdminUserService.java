package com.oceanlk.backend.service;

import com.oceanlk.backend.model.AdminUser;
import com.oceanlk.backend.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public List<AdminUser> getAllAdmins() {
        return adminUserRepository.findAll();
    }

    public Optional<AdminUser> findById(String id) {
        return adminUserRepository.findById(id);
    }

    public Optional<AdminUser> findByUsername(String username) {
        return adminUserRepository.findByUsername(username);
    }

    public Optional<AdminUser> findByEmail(String email) {
        return adminUserRepository.findByEmail(email);
    }

    public AdminUser createAdmin(AdminUser admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminUserRepository.save(admin);
    }

    public AdminUser updateAdmin(AdminUser admin) {
        return adminUserRepository.save(admin);
    }

    public void deleteAdmin(String id) {
        adminUserRepository.deleteById(id);
    }

    public void changePassword(AdminUser user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        adminUserRepository.save(user);
    }
}
