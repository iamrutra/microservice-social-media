package com.iamrutra.post_service.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.iamrutra.post_service.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findAllByPostId(Integer postId);
}
