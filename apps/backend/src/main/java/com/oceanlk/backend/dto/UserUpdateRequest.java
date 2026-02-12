package com.oceanlk.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    @Size(min = 2, message = "Name must be at least 2 characters")
    private String name;

    @Email(message = "Invalid email address")
    private String email;

    @Size(min = 3, message = "Username must be at least 3 characters")
    private String username;

    private String phone;

    private Boolean active;

    private String role;
}
