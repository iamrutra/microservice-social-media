package com.iamrutra.api_geteaway.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.UniqueElements;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    private int id;
    @NotEmpty(message = "Username cannot be empty")
    @NotNull(message = "Username cannot be empty")
    @NotBlank(message = "Username cannot be empty")
    @UniqueElements(message = "Username already exists")
    private String username;
    @NotEmpty(message = "Full name cannot be empty")
    @NotNull(message = "Full name cannot be empty")
    @NotBlank(message = "Full name cannot be empty")
    private String fullName;
    LocalDate dateOfBirth;
    @NotEmpty(message = "Password cannot be empty")
    @NotNull(message = "Password cannot be empty")
    @NotBlank(message = "Password cannot be empty")
    private String password;
    @Email(message = "Email should be valid")
    @NotEmpty(message = "Email cannot be empty")
    @NotNull(message = "Email cannot be empty")
    @NotBlank(message = "Email cannot be empty")
    private String email;
}
