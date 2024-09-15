package com.iamrutra.post_service.controller;

import com.iamrutra.post_service.service.CommentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("comments")
@Tag(name = "Comment Controller", description = "APIs for Comment management")
public class CommentController {

    private final CommentService commentService;

}
