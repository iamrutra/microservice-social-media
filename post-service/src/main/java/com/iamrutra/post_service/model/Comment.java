package com.iamrutra.post_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "_comments")
public class Comment {
    @Id
    @GeneratedValue
    private int id;
    private String comment;
    private int userId;
    @CreationTimestamp
    private String createdAt;
    @UpdateTimestamp
    private String updatedAt;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
}
