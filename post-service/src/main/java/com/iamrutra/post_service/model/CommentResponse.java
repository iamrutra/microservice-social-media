package com.iamrutra.post_service.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CommentResponse {
    private int id;
    private String comment;
    private int userId;
    private String createdAt;
    private String updatedAt;
    private int postId;
}
