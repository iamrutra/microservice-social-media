package com.iamrutra.notification_service.events;

import java.time.LocalDateTime;

public record CommentEvent(
        String senderName,
        String authorEmail,
        int authorId,
        int postId,
        LocalDateTime time
){
}
