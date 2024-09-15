package com.iamrutra.user_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UserRequest(
        Integer id,
        @NotEmpty(message = "Username cannot be empty")
        @NotNull(message = "Username cannot be empty")
        String username,
        @NotEmpty(message = "Full name cannot be empty")
        @NotNull(message = "Full name cannot be empty")
        String fullName,
        @NotNull(message = "Date of birth cannot be empty")
        LocalDate dateOfBirth,
        @NotEmpty(message = "Password cannot be empty")
        @NotNull(message = "Password cannot be empty")
        String password,
        @Email(message = "Email should be valid")
        @NotEmpty(message = "Email cannot be empty")
        @NotNull(message = "Email cannot be empty")
        String email
        ) {

}
