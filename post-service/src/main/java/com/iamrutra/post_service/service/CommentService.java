package com.iamrutra.post_service.service;

import com.iamrutra.post_service.mapper.CommentMapper;
import com.iamrutra.post_service.model.Comment;
import com.iamrutra.post_service.model.CommentRequest;
import com.iamrutra.post_service.model.CommentResponse;
import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.repository.CommentRepository;
import com.iamrutra.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final PostRepository postRepository;

    public Integer createComment(CommentRequest request) {
        var comment = commentMapper.toComment(request);
        if(postRepository.findById(request.getPostId()).isPresent()){
            Post post = postRepository.findById(request.getPostId()).get();
            post.setTotalComments(post.getTotalComments() + 1);
            postRepository.save(post);
        } else {
            throw new RuntimeException("Post not found");
        }

        return commentRepository.save(comment).getId();
    }

    public CommentResponse getComment(Integer id) {
        Optional<CommentResponse> comment = commentRepository.findById(id).map(commentMapper::toCommentResponse);
        if(comment.isPresent()){
            return comment.get();
        } else {
            throw new RuntimeException("Comment not found");
        }
    }

    public  List<CommentResponse> getAllCommentsByPostId(Integer postId) {
        List<CommentResponse> comments =
                commentRepository.findAllByPostId(postId).stream()
                        .map(commentMapper::toCommentResponse)
                        .toList();
        if(comments.isEmpty()){
            return Collections.emptyList();
        } else {
            return comments;
        }
    }

    public String deleteComment(Integer id) {
        if(commentRepository.findById(id).isPresent()){
            Comment comment = commentRepository.findById(id).get();
            Optional<Post> post = postRepository.findById(comment.getPost().getId());
            if(post.isPresent()){
                post.get().setTotalComments(post.get().getTotalComments() - 1);
                postRepository.save(post.get());
            } else {
                throw new RuntimeException("Post not found");
            }
            commentRepository.deleteById(id);
            return "Comment deleted successfully";
        } else {
            throw new RuntimeException("Comment not found");
        }
    }
}
