package com.oceanlk.backend.service;

import com.oceanlk.backend.model.ContactMessage;
import com.oceanlk.backend.model.TalentPoolApplication;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.email.hr}")
    private String hrEmail;

    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;

    public void sendApplicantConfirmation(TalentPoolApplication application) throws MessagingException {
        if (!emailEnabled) {
            System.out.println(
                    "Email sending is disabled. Skipping applicant confirmation for: " + application.getEmail());
            return;
        }
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        String toEmail = application.getEmail();
        if (toEmail == null || fromEmail == null)
            return;

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("[TEST] Thank You for Joining Our Talent Pool - Ocean Ceylon Holdings");

        String htmlContent = buildApplicantEmailTemplate(application);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    public void sendHRNotification(TalentPoolApplication application) throws MessagingException {
        if (!emailEnabled) {
            System.out.println("Email sending is disabled. Skipping HR notification for application: "
                    + application.getFullName());
            return;
        }
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        if (fromEmail == null || hrEmail == null)
            return;

        helper.setFrom(fromEmail);
        helper.setTo(hrEmail);
        helper.setSubject("[TEST] New Talent Pool Application - " + application.getFullName());

        String htmlContent = buildHREmailTemplate(application);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

    private String buildApplicantEmailTemplate(TalentPoolApplication application) {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Ocean Ceylon Holdings Talent Pool</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: linear-gradient(135deg, #0a1628 0%, #1a2847 100%);
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%);
                            border-radius: 20px;
                            overflow: hidden;
                            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        }
                        .header {
                            background: linear-gradient(135deg, #10b981 0%, #0056b3 100%);
                            padding: 40px 30px;
                            text-align: center;
                            color: white;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                            font-weight: 700;
                        }
                        .content {
                            padding: 40px 30px;
                            color: #333;
                            line-height: 1.8;
                        }
                        .content h2 {
                            color: #10b981;
                            font-size: 22px;
                            margin-top: 0;
                        }
                        .info-box {
                            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
                            border-left: 4px solid #10b981;
                            padding: 20px;
                            margin: 25px 0;
                            border-radius: 8px;
                        }
                        .info-box p {
                            margin: 8px 0;
                            color: #064e3b;
                        }
                        .info-box strong {
                            color: #065f46;
                        }
                        .cta-button {
                            display: inline-block;
                            padding: 16px 40px;
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 50px;
                            font-weight: 600;
                            margin: 20px 0;
                            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
                            transition: transform 0.3s;
                        }
                        .cta-button:hover {
                            transform: translateY(-2px);
                        }
                        .footer {
                            background: #f9fafb;
                            padding: 30px;
                            text-align: center;
                            color: #6b7280;
                            font-size: 14px;
                            border-top: 1px solid #e5e7eb;
                        }
                        .checkmark {
                            width: 60px;
                            height: 60px;
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 20px;
                            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
                        }
                        .checkmark::after {
                            content: "✓";
                            color: white;
                            font-size: 30px;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="checkmark"></div>
                            <h1>Welcome to Our Talent Pool!</h1>
                        </div>

                        <div class="content">
                            <h2>Dear %s,</h2>

                            <p>Thank you for your interest in joining Ocean Ceylon Holdings! We're excited to have you in our talent pool.</p>

                            <p>We've successfully received your application and CV. Our HR team will carefully review your profile and reach out to you when opportunities that match your skills and experience become available.</p>

                            <div class="info-box">
                                <p><strong>Application Summary:</strong></p>
                                <p><strong>Position of Interest:</strong> %s</p>
                                <p><strong>Experience Level:</strong> %s</p>
                                <p><strong>Submitted:</strong> %s</p>
                            </div>

                            <p><strong>What Happens Next?</strong></p>
                            <ul>
                                <li>Your profile will be added to our talent database</li>
                                <li>You'll receive priority consideration for matching positions</li>
                                <li>Our team will contact you directly when relevant opportunities arise</li>
                                <li>You may be invited for interviews before positions are publicly advertised</li>
                            </ul>

                            <p style="text-align: center; margin-top: 30px;">
                                <a href="https://oceanlk.com/careers" class="cta-button">Explore Current Openings</a>
                            </p>

                            <p style="margin-top: 30px;">We appreciate your patience and look forward to potentially working together in the future!</p>

                            <p style="margin-top: 30px;">
                                Best regards,<br>
                                <strong>HR Team</strong><br>
                                Ocean Ceylon Holdings
                            </p>
                        </div>

                        <div class="footer">
                            <p><strong>Ocean Ceylon Holdings</strong></p>
                            <p>Building the future of Sri Lankan enterprise</p>
                            <p style="margin-top: 15px;">
                                <a href="https://oceanlk.com" style="color: #10b981; text-decoration: none;">www.oceanlk.com</a> |
                                <a href="mailto:hr@omc.lk" style="color: #10b981; text-decoration: none;">hr@omc.lk</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        application.getFullName(),
                        application.getPosition(),
                        application.getExperience(),
                        application.getSubmittedDate()
                                .format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")));
    }

    private String buildHREmailTemplate(TalentPoolApplication application) {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Talent Pool Application</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: #f3f4f6;
                        }
                        .container {
                            max-width: 650px;
                            margin: 30px auto;
                            background: white;
                            border-radius: 15px;
                            overflow: hidden;
                            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #0056b3 0%, #003d82 100%);
                            padding: 30px;
                            color: white;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .badge {
                            display: inline-block;
                            background: rgba(255,255,255,0.2);
                            padding: 6px 14px;
                            border-radius: 20px;
                            font-size: 12px;
                            margin-top: 10px;
                            font-weight: 600;
                        }
                        .content {
                            padding: 35px;
                        }
                        .applicant-card {
                            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                            padding: 25px;
                            border-radius: 12px;
                            border: 2px solid #0ea5e9;
                            margin: 20px 0;
                        }
                        .field {
                            margin: 15px 0;
                        }
                        .field-label {
                            font-weight: 700;
                            color: #0c4a6e;
                            font-size: 13px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            margin-bottom: 5px;
                        }
                        .field-value {
                            color: #1e293b;
                            font-size: 16px;
                        }
                        .message-box {
                            background: #f8fafc;
                            padding: 20px;
                            border-radius: 8px;
                            border-left: 4px solid #0ea5e9;
                            margin: 20px 0;
                        }
                        .action-button {
                            display: inline-block;
                            padding: 14px 32px;
                            background: linear-gradient(135deg, #0056b3 0%, #003d82 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: 600;
                            margin: 10px 10px 10px 0;
                            box-shadow: 0 8px 20px rgba(0,86,179,0.3);
                        }
                        .cv-info {
                            background: #fef3c7;
                            border: 2px solid #f59e0b;
                            padding: 15px;
                            border-radius: 8px;
                            margin: 20px 0;
                        }
                        .footer {
                            background: #f9fafb;
                            padding: 20px;
                            text-align: center;
                            color: #6b7280;
                            font-size: 13px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎯 New Talent Pool Application</h1>
                            <span class="badge">REQUIRES REVIEW</span>
                        </div>

                        <div class="content">
                            <p style="font-size: 16px; color: #475569;">A new candidate has joined the talent pool. Please review their application details below:</p>

                            <div class="applicant-card">
                                <h2 style="margin-top: 0; color: #0c4a6e;">Applicant Information</h2>

                                <div class="field">
                                    <div class="field-label">Full Name</div>
                                    <div class="field-value">%s</div>
                                </div>

                                <div class="field">
                                    <div class="field-label">Email Address</div>
                                    <div class="field-value">
                                        <a href="mailto:%s" style="color: #0ea5e9; text-decoration: none;">%s</a>
                                    </div>
                                </div>

                                <div class="field">
                                    <div class="field-label">Phone Number</div>
                                    <div class="field-value">
                                        <a href="tel:%s" style="color: #0ea5e9; text-decoration: none;">%s</a>
                                    </div>
                                </div>

                                <div class="field">
                                    <div class="field-label">Desired Position</div>
                                    <div class="field-value">%s</div>
                                </div>

                                <div class="field">
                                    <div class="field-label">Years of Experience</div>
                                    <div class="field-value">%s</div>
                                </div>

                                <div class="field">
                                    <div class="field-label">Application Date</div>
                                    <div class="field-value">%s</div>
                                </div>
                            </div>

                            %s

                            <div class="message-box">
                                <div class="field-label">Candidate Message</div>
                                <p style="margin: 10px 0 0 0; color: #334155; line-height: 1.6;">%s</p>
                            </div>

                            <div style="margin-top: 30px; text-align: center;">
                                <a href="http://localhost:5173/admin/applications" class="action-button">View in Admin Panel</a>
                                <a href="mailto:%s" class="action-button" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 8px 20px rgba(16,185,129,0.3);">Contact Applicant</a>
                            </div>
                        </div>

                        <div class="footer">
                            <p>This is an automated notification from the Ocean Ceylon Holdings Talent Pool System</p>
                            <p style="margin-top: 10px;">
                                <a href="http://localhost:5173/admin" style="color: #0ea5e9; text-decoration: none;">Admin Dashboard</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        application.getFullName(),
                        application.getEmail(),
                        application.getEmail(),
                        application.getPhone(),
                        application.getPhone(),
                        application.getPosition(),
                        application.getExperience(),
                        application.getSubmittedDate()
                                .format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")),
                        application.getCvFilename() != null
                                ? "<div class=\"cv-info\"><strong>📎 CV Attached:</strong> "
                                        + application.getCvFilename() + " ("
                                        + formatFileSize(application.getCvFileSize()) + ")</div>"
                                : "",
                        application.getMessage() != null ? application.getMessage() : "No message provided.",
                        application.getEmail());
    }

    public void sendContactConfirmation(ContactMessage message) throws MessagingException {
        if (!emailEnabled) {
            System.out.println("Email sending is disabled. Skipping contact confirmation for: " + message.getEmail());
            return;
        }
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        String toEmail = message.getEmail();
        if (toEmail == null || fromEmail == null)
            return;

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("[TEST] Thank You for Contacting Ocean Ceylon Holdings");

        String htmlContent = buildContactConfirmationTemplate(message);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }

    public void sendContactNotificationToHR(ContactMessage message) throws MessagingException {
        if (!emailEnabled) {
            System.out.println("Email sending is disabled. Skipping HR notification for contact message from: "
                    + message.getName());
            return;
        }
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        if (fromEmail == null || hrEmail == null)
            return;

        helper.setFrom(fromEmail);
        helper.setTo(hrEmail);
        helper.setSubject("[TEST] New Contact Form Submission - " + message.getSubject());

        String htmlContent = buildContactHRNotificationTemplate(message);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }

    private String buildContactConfirmationTemplate(ContactMessage message) {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Thank You - Ocean Ceylon Holdings</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: linear-gradient(135deg, #0a1628 0%, #1a2847 100%);
                        }
                        .container {
                            max-width: 600px;
                            margin: 40px auto;
                            background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%);
                            border-radius: 20px;
                            overflow: hidden;
                            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                        }
                        .header {
                            background: linear-gradient(135deg, #059669 0%, #0056b3 100%);
                            padding: 40px 30px;
                            text-align: center;
                            color: white;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                            font-weight: 700;
                        }
                        .content {
                            padding: 40px 30px;
                            color: #333;
                            line-height: 1.8;
                        }
                        .content h2 {
                            color: #059669;
                            font-size: 22px;
                            margin-top: 0;
                        }
                        .info-box {
                            background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
                            border-left: 4px solid #059669;
                            padding: 20px;
                            margin: 25px 0;
                            border-radius: 8px;
                        }
                        .info-box p {
                            margin: 8px 0;
                            color: #064e3b;
                        }
                        .checkmark {
                            width: 60px;
                            height: 60px;
                            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 20px;
                            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
                        }
                        .checkmark::after {
                            content: "✓";
                            color: white;
                            font-size: 30px;
                            font-weight: bold;
                        }
                        .footer {
                            background: #f9fafb;
                            padding: 30px;
                            text-align: center;
                            color: #6b7280;
                            font-size: 14px;
                            border-top: 1px solid #e5e7eb;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="checkmark"></div>
                            <h1>Message Received!</h1>
                        </div>

                        <div class="content">
                            <h2>Dear %s,</h2>

                            <p>Thank you for reaching out to Ocean Ceylon Holdings. We have successfully received your message and our team will review it shortly.</p>

                            <div class="info-box">
                                <p><strong>Your Message Summary:</strong></p>
                                <p><strong>Subject:</strong> %s</p>
                                <p><strong>Submitted:</strong> %s</p>
                            </div>

                            <p><strong>What happens next?</strong></p>
                            <ul>
                                <li>Our team will review your message within 24-48 hours</li>
                                <li>You will receive a response from the appropriate department</li>
                                <li>For urgent matters, please call us directly</li>
                            </ul>

                            <p style="margin-top: 30px;">We appreciate your interest in Ocean Ceylon Holdings and look forward to assisting you.</p>

                            <p style="margin-top: 30px;">
                                Best regards,<br>
                                <strong>Ocean Ceylon Holdings Team</strong>
                            </p>
                        </div>

                        <div class="footer">
                            <p><strong>Ocean Ceylon Holdings</strong></p>
                            <p>Building the future of Sri Lankan enterprise</p>
                            <p style="margin-top: 15px;">
                                <a href="https://oceanlk.com" style="color: #10b981; text-decoration: none;">www.oceanlk.com</a> |
                                <a href="mailto:info@oceanlk.com" style="color: #10b981; text-decoration: none;">info@oceanlk.com</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        message.getName(),
                        message.getSubject(),
                        message.getSubmittedDate()
                                .format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")));
    }

    private String buildContactHRNotificationTemplate(ContactMessage message) {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Contact Form Submission</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: #f3f4f6;
                        }
                        .container {
                            max-width: 650px;
                            margin: 30px auto;
                            background: white;
                            border-radius: 15px;
                            overflow: hidden;
                            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #0056b3 0%, #003d82 100%);
                            padding: 30px;
                            color: white;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .badge {
                            display: inline-block;
                            background: rgba(255,255,255,0.2);
                            padding: 6px 14px;
                            border-radius: 20px;
                            font-size: 12px;
                            margin-top: 10px;
                            font-weight: 600;
                        }
                        .content {
                            padding: 35px;
                        }
                        .contact-card {
                            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                            padding: 25px;
                            border-radius: 12px;
                            border: 2px solid #0ea5e9;
                            margin: 20px 0;
                        }
                        .field {
                            margin: 15px 0;
                        }
                        .field-label {
                            font-weight: 700;
                            color: #0c4a6e;
                            font-size: 13px;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            margin-bottom: 5px;
                        }
                        .field-value {
                            color: #1e293b;
                            font-size: 16px;
                        }
                        .message-box {
                            background: #f8fafc;
                            padding: 20px;
                            border-radius: 8px;
                            border-left: 4px solid #0ea5e9;
                            margin: 20px 0;
                        }
                        .action-button {
                            display: inline-block;
                            padding: 14px 32px;
                            background: linear-gradient(135deg, #0056b3 0%, #003d82 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: 600;
                            margin: 10px 10px 10px 0;
                            box-shadow: 0 8px 20px rgba(0,86,179,0.3);
                        }
                        .footer {
                            background: #f9fafb;
                            padding: 20px;
                            text-align: center;
                            color: #6b7280;
                            font-size: 13px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📧 New Contact Form Submission</h1>
                            <span class="badge">REQUIRES REVIEW</span>
                        </div>

                        <div class="content">
                            <p style="font-size: 16px; color: #475569;">A new contact form has been submitted. Please review the details below:</p>

                            <div class="contact-card">
                                <h2 style="margin-top: 0; color: #0c4a6e;">Contact Information</h2>

                                <div class="field">
                                    <div class="field-label">Name</div>
                                    <div class="field-value">%s</div>
                                </div>

                                <div class="field">
                                    <div class="field-label">Email Address</div>
                                    <div class="field-value">
                                        <a href="mailto:%s" style="color: #0ea5e9; text-decoration: none;">%s</a>
                                    </div>
                                </div>

                                <div class="field">
                                    <div class="field-label">Phone Number</div>
                                    <div class="field-value">%s</div>
                                </div>

                                <div class="field">
                                    <div class="field-label">Subject</div>
                                    <div class="field-value">%s</div>
                                </div>

                                <div class="field">
                                    <div class="field-label">Submission Date</div>
                                    <div class="field-value">%s</div>
                                </div>
                            </div>

                            <div class="message-box">
                                <div class="field-label">Message</div>
                                <p style="margin: 10px 0 0 0; color: #334155; line-height: 1.6;">%s</p>
                            </div>

                            <div style="margin-top: 30px; text-align: center;">
                                <a href="http://localhost:5173/admin/contact-messages" class="action-button">View in Admin Panel</a>
                                <a href="mailto:%s" class="action-button" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); box-shadow: 0 8px 20px rgba(16,185,129,0.3);">Reply to Contact</a>
                            </div>
                        </div>

                        <div class="footer">
                            <p>This is an automated notification from the Ocean Ceylon Holdings Contact System</p>
                            <p style="margin-top: 10px;">
                                <a href="http://localhost:5173/admin" style="color: #0ea5e9; text-decoration: none;">Admin Dashboard</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(
                        message.getName(),
                        message.getEmail(),
                        message.getEmail(),
                        message.getPhone() != null ? message.getPhone() : "Not provided",
                        message.getSubject(),
                        message.getSubmittedDate()
                                .format(DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a")),
                        message.getMessage(),
                        message.getEmail());
    }

    public void sendAdminNotification(String email, String subject, String message, String link)
            throws MessagingException {
        if (!emailEnabled) {
            log.info("Email sending disabled. Admin notification for {}: {}", email, message);
            return;
        }

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(email);
        helper.setSubject("[OceanLK Alert] " + subject);

        String htmlContent = buildAdminNotificationTemplate(subject, message, link);
        helper.setText(htmlContent, true);

        mailSender.send(mimeMessage);
    }

    private String buildAdminNotificationTemplate(String subject, String message, String link) {
        String actionButton = (link != null && !link.isEmpty())
                ? String.format("<a href=\"http://localhost:5173%s\" class=\"action-button\">View Details</a>", link)
                : "";

        String loginButton = "<a href=\"http://localhost:5173/admin\" class=\"action-button secondary\">Login to Admin Portal</a>";

        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; background: #f3f4f6; }
                        .container { max-width: 600px; margin: 30px auto; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
                        .header { background: linear-gradient(135deg, #0f1e3a 0%, #1a2847 100%); padding: 30px; color: white; text-align: center; }
                        .header h1 { margin: 0; font-size: 24px; color: white !important; }
                        .content { padding: 40px; color: #333; line-height: 1.6; }
                        .alert-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
                        .button-group { margin-top: 30px; text-align: center; }
                        .action-button { display: inline-block; padding: 14px 28px; background: #3b82f6; color: white !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 5px; }
                        .action-button.secondary { background: #1f2937; }
                        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>System Notification</h1>
                        </div>
                        <div class="content">
                            <h2 style="color: #0f1e3a; margin-top: 0;">%s</h2>
                            <div class="alert-box">
                                %s
                            </div>
                            <div class="button-group">
                                %s
                                %s
                            </div>
                        </div>
                        <div class="footer">
                            <p>This is an automated administrative alert from Ocean Ceylon Holdings.</p>
                        </div>
                    </div>
                </body>
                </html>
                """
                .formatted(subject, message, actionButton, loginButton);
    }

    private String formatFileSize(Long bytes) {

        if (bytes == null)
            return "Unknown size";
        if (bytes < 1024)
            return bytes + " B";
        if (bytes < 1024 * 1024)
            return String.format("%.2f KB", bytes / 1024.0);
        return String.format("%.2f MB", bytes / (1024.0 * 1024.0));
    }

    public void sendOtpEmail(String email, String otp, String username) throws MessagingException {
        if (!emailEnabled) {
            System.out.println("Email sending is disabled. OTP for " + email + " is: " + otp);
            return;
        }
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        if (fromEmail == null || email == null)
            return;

        helper.setFrom(fromEmail);
        helper.setTo(email);
        helper.setSubject("[OceanLK] Your Verification Code");

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #10b981; text-align: center;">Verification Code</h2>
                        <p>Hello %s,</p>
                        <p>Your verification code for OceanLK Admin Portal is:</p>
                        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0056b3; border-radius: 5px; margin: 20px 0;">
                            %s
                        </div>
                        <p>This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #888; text-align: center;">
                            This is an automated message from Ocean Ceylon Holdings.
                        </p>
                    </div>
                </body>
                </html>
                """
                .formatted(username, otp);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    public void sendAdminWelcomeEmail(com.oceanlk.backend.model.AdminUser admin, String plainPassword)
            throws MessagingException {
        if (!emailEnabled) {
            System.out.println("Email sending is disabled. Skipping welcome email for new admin: " + admin.getEmail());
            return;
        }
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(admin.getEmail());
        helper.setSubject("[OceanLK] Welcome to the Admin Team");

        String loginUrl = "http://localhost:5173/admin/login";

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        .button {
                            display: inline-block;
                            padding: 12px 24px;
                            background-color: #10b981;
                            color: white;
                            text-decoration: none;
                            border-radius: 8px;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9fafb; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <h2 style="color: #0056b3; margin-top: 0;">Welcome, %s!</h2>
                        <p>A new administrator account has been created for you on the <strong>OceanLK Admin Portal</strong>.</p>

                        <div style="background: #f3f4f6; padding: 25px; border-radius: 12px; margin: 25px 0;">
                            <h3 style="margin-top: 0; font-size: 16px; color: #4b5563;">Your Login Credentials</h3>
                            <p style="margin: 5px 0;"><strong>Username:</strong> %s</p>
                            <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">%s</code></p>
                            <p style="margin: 5px 0;"><strong>Role:</strong> %s</p>
                        </div>

                        <p>You can log in to the admin panel using the link below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s" class="button" style="color: white !important;">Login to Admin Panel</a>
                        </div>

                        <p style="font-size: 14px; color: #6b7280;">Security Note: Please change your password immediately after your first login.</p>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                            This is an automated message from Ocean Ceylon Holdings.
                        </p>
                    </div>
                </body>
                </html>
                """
                .formatted(admin.getUsername(), admin.getUsername(), plainPassword, admin.getRole(), loginUrl);

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }
}
