package com.iamrutra.post_service.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LikeRequest {
    private int postId;
    private int userId;
}
