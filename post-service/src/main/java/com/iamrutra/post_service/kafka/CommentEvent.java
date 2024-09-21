package com.iamrutra.post_service.kafka;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;


public record CommentEvent(
        @JsonProperty("senderName")
        String senderName,
        @JsonProperty("authorEmail")
        String authorEmail,
        @JsonProperty("authorId")
        int authorId,
        @JsonProperty("postId")
        int postId,
        @JsonProperty("time")
        LocalDateTime time
){
}
