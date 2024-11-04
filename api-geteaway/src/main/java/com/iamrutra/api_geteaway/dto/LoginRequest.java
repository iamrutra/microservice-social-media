package com.iamrutra.api_geteaway.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginRequest {
    @NotEmpty(message = "Username cannot be empty")
    @NotNull(message = "Username cannot be empty")
    @NotBlank(message = "Username cannot be empty")
    private String username;
    @NotEmpty(message = "Password cannot be empty")
    @NotNull(message = "Password cannot be empty")
    @NotBlank(message = "Password cannot be empty")
    private String password;
}
