package com.iamrutra.post_service.mapper;

import com.iamrutra.post_service.model.LikeResponse;
import com.iamrutra.post_service.model.Likes;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class LikeMapper {
    public List<LikeResponse> mapToListLikeResponse(List<Likes> likes) {
        return likes.stream().map(like -> {
            LikeResponse response = new LikeResponse();
            response.setId(like.getId());
            response.setPostId(like.getPost().getId());
            response.setUserId(like.getUserId());
            return response;
        }).collect(Collectors.toList());
    }
}
