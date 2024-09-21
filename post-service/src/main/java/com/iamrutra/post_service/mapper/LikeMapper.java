package com.iamrutra.post_service.mapper;

import com.iamrutra.post_service.model.LikeResponse;
import com.iamrutra.post_service.model.Like;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class LikeMapper {

    public Page<LikeResponse> mapToListLikeResponse(Page<Like> likes, Pageable pageable) {
        List<LikeResponse> likeResponses = likes.stream().map(like -> {
            return LikeResponse.builder()
                    .id(like.getId())
                    .postId(like.getPost().getId())
                    .userId(like.getUserId())
                    .build();
        }).toList();

        return new PageImpl<>(likeResponses, pageable, likes.getTotalElements());
    }
}
