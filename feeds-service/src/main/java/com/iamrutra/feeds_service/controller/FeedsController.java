package com.iamrutra.feeds_service.controller;

import com.iamrutra.feeds_service.user.PostClient;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/feeds")
@RequiredArgsConstructor
@Tag(name = "Feed Controller", description = "APIs for Feed")
public class FeedsController {

    private final PostClient postClient;

    @GetMapping
    public ResponseEntity<?> getFeeds(){
        return ResponseEntity.ok(postClient.getAllPosts(0, 10, "createdAt", false));
    }
}
