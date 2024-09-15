package com.iamrutra.post_service.repository;

import com.iamrutra.post_service.model.Likes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Likes, Integer> {
    Optional<Likes> findByPostIdAndUserId(Integer postId, Integer userId);

    List<Likes> findAllByPostId(Integer postId);
    List<Likes> findAllByUserId(Integer userId);
}
