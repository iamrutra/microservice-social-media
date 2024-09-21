package com.iamrutra.post_service.controller;

import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.model.PostRequest;
import com.iamrutra.post_service.service.PostService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public ResponseEntity<Page<Post>> getPostsByUserId(
            @PathVariable("id") int userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean ascending
    ) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(postService.getPostsByUserId(userId, pageable));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable("id") int id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePostById(@PathVariable("id") int id) {
        return ResponseEntity.ok(postService.deletePostById(id));
    }

}
