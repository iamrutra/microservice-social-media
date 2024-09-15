package com.iamrutra.post_service.service;

import com.iamrutra.post_service.mapper.LikeMapper;
import com.iamrutra.post_service.model.LikeResponse;
import com.iamrutra.post_service.model.Likes;
import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.repository.LikeRepository;
import com.iamrutra.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final LikeMapper likeMapper;

    public void likePost(int postId, int userId) {
        Optional<Post> post = postRepository.findById(postId);
        Likes like = Likes.builder()
                .post(post.get())
                .userId(userId)
                .build();
        likeRepository.save(like);
    }

    public List<LikeResponse> getLikesByPostId(int postId) {
        List<Likes> likes = likeRepository.findAllByPostId(postId);
        return likeMapper.mapToListLikeResponse(likes);
    }

    public List<LikeResponse> getLikesByUserId(int userId) {
        List<Likes> likes = likeRepository.findAllByUserId(userId);
        return likeMapper.mapToListLikeResponse(likes);
    }
}
