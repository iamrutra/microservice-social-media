package com.iamrutra.post_service.service;

import com.iamrutra.post_service.mapper.LikeMapper;
import com.iamrutra.post_service.model.LikeResponse;
import com.iamrutra.post_service.model.Like;
import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.repository.LikeRepository;
import com.iamrutra.post_service.repository.PostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final LikeMapper likeMapper;

    @Transactional
    public void likePost(int postId, int userId) {
        Post post = postRepository.findById(postId).get();
        if(!likeRepository.existsByPostIdAndUserId(postId, userId)) {
            post.setTotalLikes(post.getTotalLikes() + 1);
            Like like = Like.builder()
                    .post(post)
                    .userId(userId)
                    .build();
            postRepository.save(post);
            likeRepository.save(like);
        } else {
            post.setTotalLikes(post.getTotalLikes() - 1);
            likeRepository.deleteByPostIdAndUserId(postId, userId);
            postRepository.save(post);
        }

    }

    public List<LikeResponse> getLikesByPostId(int postId) {
        List<Like> likes = likeRepository.findAllByPostId(postId);
        return likeMapper.mapToListLikeResponse(likes);
    }

    public List<LikeResponse> getLikesByUserId(int userId) {
        List<Like> likes = likeRepository.findAllByUserId(userId);
        return likeMapper.mapToListLikeResponse(likes);
    }
}
