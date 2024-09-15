package com.iamrutra.post_service.model;

import com.iamrutra.post_service.client.UserRep;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LikeResponse {
    private Integer id;
    private Integer postId;
    private Integer userId;
}