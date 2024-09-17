package com.iamrutra.post_service.mapper;

import com.iamrutra.post_service.model.LikeResponse;
import com.iamrutra.post_service.model.Like;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class LikeMapper {
    public List<LikeResponse> mapToListLikeResponse(List<Like> likes) {
        return likes.stream().map(like -> {
            return LikeResponse.builder()
                    .id(like.getId())
                    .postId(like.getPost().getId())
                    .userId(like.getUserId())
                    .build();
        }).collect(Collectors.toList());
    }
}
