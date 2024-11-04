package com.iamrutra.post_service.repository;

import com.iamrutra.post_service.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Integer> {
    Page<Post> findAllByUserId(Integer userId, Pageable pageable);
}
