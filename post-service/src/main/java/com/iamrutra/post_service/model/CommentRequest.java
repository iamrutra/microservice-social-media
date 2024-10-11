package com.iamrutra.post_service.model;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest {
    private String comment;
    private int userId;
    private int postId;
}
