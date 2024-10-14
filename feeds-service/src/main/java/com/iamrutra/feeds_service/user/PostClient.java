package com.iamrutra.feeds_service.user;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "post-client", url = "http://localhost:8020/api/v1/posts")
public interface PostClient {
    @GetMapping("/all")
    public ResponseEntity<Page<PostRep>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean ascending
    );
}
