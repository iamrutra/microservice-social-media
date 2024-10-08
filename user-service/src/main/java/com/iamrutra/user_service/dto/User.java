package com.iamrutra.user_service.dto;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


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
    private LocalDate dateOfBirth;
    @Column(unique = true)
    private String email;
    private String password;
    private String profileImageLink;
    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> roles;

    private boolean isLocked;
    private boolean isEnabled;
}
