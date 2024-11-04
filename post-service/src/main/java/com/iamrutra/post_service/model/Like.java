package com.iamrutra.post_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "_likes")
public class Like {
    @Id
    @GeneratedValue
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
    private Integer userId;
    @CreationTimestamp
    private LocalDateTime createdAt;
}
