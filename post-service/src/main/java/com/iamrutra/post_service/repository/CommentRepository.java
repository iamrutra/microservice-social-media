package com.iamrutra.post_service.repository;

import com.iamrutra.post_service.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
}
