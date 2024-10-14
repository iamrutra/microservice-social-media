package com.iamrutra.feeds_service.user;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PostRep {
    private Integer id;
    private String title;
    private String content;
    private Integer userId;
    private Integer totalLikes;
    private Integer totalComments;
    private String postImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
