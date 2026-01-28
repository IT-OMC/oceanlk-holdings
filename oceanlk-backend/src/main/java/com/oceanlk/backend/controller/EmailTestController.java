package com.oceanlk.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class EmailTestController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send-email")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            String subject = request.getOrDefault("subject", "Test Email from OceanLK");
            String body = request.getOrDefault("body", "This is a test email from Ocean Ceylon Holdings!");

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("minidu.punsara19@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText("<h1>Test Email</h1><p>" + body + "</p>", true);

            mailSender.send(message);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Email sent successfully to " + to));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()));
        }
    }
}
