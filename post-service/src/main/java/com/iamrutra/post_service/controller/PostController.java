package com.iamrutra.post_service.controller;

import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.model.PostRequest;
import com.iamrutra.post_service.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("posts")
@Tag(name = "Post Controller", description = "APIs for post management")
public class PostController {

    private final PostService postService;

    @PostMapping("/create")
    public ResponseEntity<Integer> createPost(@RequestBody PostRequest request) {
        return ResponseEntity.created(null).body(postService.createPost(request));
    }


    @GetMapping("/user/{id}")
    public ResponseEntity<List<Post>> getPostsByUserId(@PathVariable("id") int userId) {
        return ResponseEntity.ok(postService.getPostsByUserId(userId));
    }

}
