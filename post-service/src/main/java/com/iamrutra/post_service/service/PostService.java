package com.iamrutra.post_service.service;

import com.iamrutra.post_service.mapper.PostMapper;
import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.model.PostRequest;
import com.iamrutra.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
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

    public List<Post> getPostsByUserId(Integer userId) {
        if(postRepository.findById(userId).isPresent()) {
            return postRepository.findAllByUserId(userId);
        } else {
            throw new RuntimeException("User with id " + userId + " not found");
        }

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
