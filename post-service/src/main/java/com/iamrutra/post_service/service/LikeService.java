package com.iamrutra.post_service.service;

import com.iamrutra.post_service.mapper.LikeMapper;
import com.iamrutra.post_service.model.LikeResponse;
import com.iamrutra.post_service.model.Like;
import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.repository.LikeRepository;
import com.iamrutra.post_service.repository.PostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private static final Logger log = LoggerFactory.getLogger(LikeService.class);
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final LikeMapper likeMapper;

    @Transactional
    public void updatePostLikeStatus(int postId, int userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post with id " + postId + " not found"));
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

    public Page<LikeResponse> getLikesByPostId(int postId, Pageable pageable) {
        Page<Like> likes = likeRepository.findAllByPostId(postId, pageable);
        return likeMapper.mapToListLikeResponse(likes, pageable);
    }

    public Page<LikeResponse> getLikesByUserId(int userId, Pageable pageable) {
        Page<Like> likes = likeRepository.findAllByUserId(userId, pageable);
        return likeMapper.mapToListLikeResponse(likes, pageable);
    }

    public Optional<Like> findByUserIdAndPostId(int userId, int postId) {
        return likeRepository.findByUserIdAndPostId(userId, postId);
    }

    @Transactional
    public ResponseEntity<?> deleteByPostId(int postId) {
        likeRepository.deleteByPostId(postId);
        return ResponseEntity.ok().build();
    }
}
