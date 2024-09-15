package com.iamrutra.post_service.service;

import com.iamrutra.post_service.client.UserClient;
import com.iamrutra.post_service.client.UserRep;
import com.iamrutra.post_service.mapper.PostMapper;
import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.model.PostRequest;
import com.iamrutra.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final UserClient userClient;

    public Integer createPost(PostRequest request) {
        Post post = postMapper.mapToPost(request);
        return postRepository.save(post).getId();
    }

    public List<Post> getPostsByUserId(Integer userId) {
        return postRepository.findAllByUserId(userId);
    }
}
