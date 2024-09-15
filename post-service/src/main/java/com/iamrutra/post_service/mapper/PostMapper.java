package com.iamrutra.post_service.mapper;

import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.model.PostRequest;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {
    public Post mapToPost(PostRequest request) {
        return Post.builder()
                .id(request.id())
                .title(request.title())
                .content(request.content())
                .userId(request.userId())
                .build();
    }
}
