package com.iamrutra.post_service.service;

import com.iamrutra.post_service.client.UserClient;
import com.iamrutra.post_service.mapper.PostMapper;
import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.model.PostRequest;
import com.iamrutra.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
        if()
        return postRepository.findAllByUserId(userId);
    }

    public Post getPostById(Integer postId) {
        if(!postRepository.existsById(postId)) {
            throw new RuntimeException("Post with id " + postId + " not found");
        }
        return postRepository.findById(postId).get();
    }

    public String deletePostById(int id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Post with id " + id + " not found");
        }
        postRepository.deleteById(id);
        return "Post with deleted successfully";
    }
}
