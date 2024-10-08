package com.iamrutra.post_service.controller;

import com.iamrutra.post_service.model.Like;
import com.iamrutra.post_service.model.LikeRequest;
import com.iamrutra.post_service.service.LikeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("likes")
@Tag(name = "Post Controller", description = "APIs for post management")
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/like")
    public ResponseEntity<?> updatePostLikeStatus(@RequestBody LikeRequest request) {
        likeService.updatePostLikeStatus(request.getPostId(), request.getUserId());
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getLikesByPostId(
            @PathVariable int postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean ascending
    ) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(likeService.getLikesByPostId(postId, pageable));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getLikesByUserId(
            @PathVariable int userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean ascending
    ) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(likeService.getLikesByUserId(userId, pageable));
    }

    @GetMapping("/findByUserIdAndPostId")
    public Optional<Like> findByUserIdAndPostId(@RequestBody LikeRequest request){
        return ResponseEntity.ok(likeService.findByUserIdAndPostId(request.getUserId(), request.getPostId())).getBody();
    }

}
