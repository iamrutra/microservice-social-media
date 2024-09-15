package com.iamrutra.post_service.repository;

import com.iamrutra.post_service.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Integer> {
    List<Post> findAllByUserId(Integer userId);
}
