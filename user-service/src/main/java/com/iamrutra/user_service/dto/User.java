package com.iamrutra.user_service.dto;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Getter
@Setter
@Entity
@Builder
@Table(name = "_users")
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue
    private Integer id;
    @Column(unique = true)
    private String username;
    private String fullName;
    private GenderType genderType;
    private LocalDate dateOfBirth;
    @Column(unique = true)
    private String email;
    private String password;
    @CreationTimestamp
    private LocalDateTime createdAt;
    private String role;
    private boolean isLocked;
    private boolean isEnabled;
}
