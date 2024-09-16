package com.iamrutra.post_service.controller;

import com.iamrutra.post_service.model.CommentRequest;
import com.iamrutra.post_service.model.CommentResponse;
import com.iamrutra.post_service.service.CommentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("comments")
@Tag(name = "Comment Controller", description = "APIs for Comment management")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/create")
    public ResponseEntity<Integer> createComment(@RequestBody CommentRequest comment) {
        return ResponseEntity.ok(commentService.createComment(comment));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<CommentResponse> getComment(@PathVariable Integer id) {
        return ResponseEntity.ok(commentService.getComment(id));
    }

    @GetMapping("/get/{postId}")
    public ResponseEntity<List<CommentResponse>> getAllCommentsByPostId(@PathVariable Integer postId) {
        return ResponseEntity.ok(commentService.getAllCommentsByPostId(postId));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Integer id) {
        return ResponseEntity.ok(commentService.deleteComment(id));
    }
}
