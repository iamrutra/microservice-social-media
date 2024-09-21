package com.iamrutra.post_service.repository;

import com.iamrutra.post_service.model.Like;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Integer> {
    Optional<Like> findByPostIdAndUserId(Integer postId, Integer userId);

    Page<Like> findAllByPostId(Integer postId, Pageable pageable);
    Page<Like> findAllByUserId(Integer userId, Pageable pageable);

    boolean existsByPostIdAndUserId(int postId, int userId);

    void deleteByPostIdAndUserId(int postId, int userId);
}
