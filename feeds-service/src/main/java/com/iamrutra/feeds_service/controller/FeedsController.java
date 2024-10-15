package com.iamrutra.feeds_service.controller;

import com.iamrutra.feeds_service.user.PostClient;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feeds")
@RequiredArgsConstructor
@Tag(name = "Feed Controller", description = "APIs for Feed")
public class FeedsController {

    private final PostClient postClient;

    @GetMapping
    public ResponseEntity<?> getFeeds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean ascending
    ){
        return ResponseEntity.ok(postClient.getAllPosts(page, size, sortBy, ascending));
    }
}
