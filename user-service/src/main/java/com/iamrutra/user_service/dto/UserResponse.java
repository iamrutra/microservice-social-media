package com.iamrutra.user_service.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Integer id;
    private String username;
    private String fullName;
    private LocalDate dateOfBirth;
    private String email;
    private String password;
    private String profileImageLink;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<User> following;
    private List<User> followers;
    private List<String> roles;
    private String status;
    private boolean isLocked;
    private boolean isEnabled;
}
