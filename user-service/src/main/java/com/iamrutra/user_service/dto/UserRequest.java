package com.iamrutra.user_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.UniqueElements;

import java.time.LocalDate;
import java.util.List;

public record UserRequest(
        Integer id,
        @UniqueElements(message = "Username already exists")
        String username,
        String keycloakId,
        String status,
        String fullName,
        LocalDate dateOfBirth,
        String password,
        @Email(message = "Email should be valid")
        String email,
        String profileImageLink
        ) {

}
