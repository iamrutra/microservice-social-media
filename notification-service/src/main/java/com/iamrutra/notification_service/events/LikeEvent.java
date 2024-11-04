package com.iamrutra.notification_service.events;

import java.time.LocalDateTime;

public record LikeEvent(
        String senderName,
        String authorEmail,
        int authorId,
        int postId,
        LocalDateTime time
){
}
