package com.iamrutra.post_service.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CommentRequest {
    private String comment;
    private int userId;
    private int postId;
}
