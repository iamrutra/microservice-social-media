package com.iamrutra.post_service.kafka;

import java.time.LocalDateTime;

public record LikeEvent(
        String senderName,
        String authorEmail,
        int authorId,
        int postId,
        LocalDateTime time
){
}
