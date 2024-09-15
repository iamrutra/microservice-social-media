package com.iamrutra.post_service.repository;

import com.iamrutra.post_service.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Integer> {
    Optional<Like> findByPostIdAndUserId(Integer postId, Integer userId);

    List<Like> findAllByPostId(Integer postId);
    List<Like> findAllByUserId(Integer userId);

    boolean existsByPostIdAndUserId(int postId, int userId);

    void deleteByPostIdAndUserId(int postId, int userId);
}
