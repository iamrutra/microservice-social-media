package com.iamrutra.post_service.controller;

import com.iamrutra.post_service.model.CommentRequest;
import com.iamrutra.post_service.model.CommentResponse;
import com.iamrutra.post_service.service.CommentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
    public ResponseEntity<CommentResponse> getComment(@PathVariable int id) {
        return ResponseEntity.ok(commentService.getComment(id));
    }

    @GetMapping("/getAll/{postId}")
    public ResponseEntity<Page<CommentResponse>> getAllCommentsByPostId(
            @PathVariable int postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean ascending
    ) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(commentService.getAllCommentsByPostId(postId, pageable));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Integer id) {
        return ResponseEntity.ok(commentService.deleteComment(id));
    }
}
