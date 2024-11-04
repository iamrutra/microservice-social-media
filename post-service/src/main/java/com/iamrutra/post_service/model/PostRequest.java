package com.iamrutra.post_service.model;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record PostRequest (
        int id,
        @NotNull(message = "Title cannot be null")
        @NotEmpty(message = "Title cannot be empty")
        @NotBlank(message = "Title cannot be blank")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        String title,
        @NotNull(message = "Content cannot be null")
        @NotEmpty(message = "Content cannot be empty")
        @NotBlank(message = "Content cannot be blank")
        @Size(min = 3, max = 1000, message = "Content must be between 3 and 1000 characters")
        String content,
        @NotNull(message = "Content cannot be null")
        @NotEmpty(message = "Content cannot be empty")
        @NotBlank(message = "Content cannot be blank")
        Integer userId

){

}
