package com.iamrutra.post_service.controller;

import com.iamrutra.post_service.model.LikeRequest;
import com.iamrutra.post_service.service.LikeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("likes")
@Tag(name = "Post Controller", description = "APIs for post management")
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/like")
    public ResponseEntity<?> likePost(@RequestBody LikeRequest request) {
        likeService.likePost(request.getPostId(), request.getUserId());
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getLikesByPostId(@PathVariable int postId) {
        return ResponseEntity.ok(likeService.getLikesByPostId(postId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getLikesByUserId(@PathVariable int userId) {
        return ResponseEntity.ok(likeService.getLikesByUserId(userId));
    }

}
