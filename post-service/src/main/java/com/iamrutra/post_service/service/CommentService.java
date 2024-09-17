package com.iamrutra.post_service.service;

import com.iamrutra.post_service.HttpClient.user.UserClient;
import com.iamrutra.post_service.HttpClient.user.UserRep;
import com.iamrutra.post_service.kafka.CommentEvent;
import com.iamrutra.post_service.mapper.CommentMapper;
import com.iamrutra.post_service.model.Comment;
import com.iamrutra.post_service.model.CommentRequest;
import com.iamrutra.post_service.model.CommentResponse;
import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.repository.CommentRepository;
import com.iamrutra.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final PostRepository postRepository;
    private final UserClient userClient;
    private final KafkaTemplate<Integer, CommentEvent> kafkaTemplate;

    public Integer createComment(CommentRequest request) {
        if(postRepository.findById(request.getPostId()).isPresent()){
            var comment = commentMapper.toComment(request);
            UserRep user = userClient.findUserById(request.getUserId());
            Post post = postRepository.findById(request.getPostId())
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            post.setTotalComments(post.getTotalComments() + 1);
            postRepository.save(post);
            sendNewCommentEvent(user.getUsername(), user.getEmail(), post.getUserId(), post.getId(), "COMMENT");
            return commentRepository.save(comment).getId();
        } else {
            throw new RuntimeException("Post not found");
        }
    }


    @Async
    public void sendNewCommentEvent(String sender, String senderEmail, int authorId, int postId, String typeEvent) {
        var event = new CommentEvent(
                sender,
                senderEmail,
                authorId,
                postId,
                LocalDateTime.now(),
                typeEvent
        );
        kafkaTemplate.send("post-service-topic", event);
    }

    public CommentResponse getComment(Integer id) {
        return commentRepository.findById(id).map(commentMapper::toCommentResponse)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

    }

    public List<CommentResponse> getAllCommentsByPostId(Integer postId) {
        return commentRepository.findAllByPostId(postId).stream()
                .map(commentMapper::toCommentResponse)
                .toList();

    }

    public String deleteComment(Integer id) {
        if(commentRepository.findById(id).isPresent()){
            Comment comment = commentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Comment not found"));
            Post post = postRepository.findById(comment.getPost().getId())
                    .orElseThrow(() -> new RuntimeException("Post not found"));
            post.setTotalComments(post.getTotalComments() - 1);
            postRepository.save(post);
            commentRepository.deleteById(id);
            return "Comment deleted successfully";
        } else {
            throw new RuntimeException("Comment not found");
        }
    }
}
