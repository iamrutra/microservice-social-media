package com.iamrutra.post_service.controller;

import com.iamrutra.post_service.model.LikeRequest;
import com.iamrutra.post_service.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("likes")
public class LikeController {

    private final LikeService likeService;

    @PostMapping
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
