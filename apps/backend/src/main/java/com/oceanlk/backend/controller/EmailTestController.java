package com.oceanlk.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class EmailTestController {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @PostMapping("/send-email")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, String> request) {
        try {
            String to = request.get("to");
            if (to == null || to.isEmpty()) {
                throw new IllegalArgumentException("Recipient 'to' address is required");
            }

            String subject = request.get("subject");
            if (subject == null) {
                subject = "Test Email from OceanLK";
            }

            String body = request.get("body");
            if (body == null) {
                body = "This is a test email from Ocean Ceylon Holdings!";
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
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
