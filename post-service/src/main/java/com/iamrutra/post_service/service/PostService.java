package com.iamrutra.post_service.service;

import com.iamrutra.post_service.mapper.PostMapper;
import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.model.PostRequest;
import com.iamrutra.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;

    public Integer createPost(PostRequest request) {
        Post post = postMapper.mapToPost(request);
        return postRepository.save(post).getId();
    }

    public Page<Post> getPostsByUserId(Integer userId, Pageable pageable) {
        return postRepository.findAllByUserId(userId, pageable);
    }

    public Post getPostById(Integer postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post with id " + postId + " not found"));
    }

    public String deletePostById(int id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Post with id " + id + " not found");
        }
        postRepository.deleteById(id);
        return "Post with deleted successfully";
    }
}
