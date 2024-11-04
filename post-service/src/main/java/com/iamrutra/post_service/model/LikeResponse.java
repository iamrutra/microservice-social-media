package com.iamrutra.post_service.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class LikeResponse {
    private Integer id;
    private Integer postId;
    private Integer userId;
}