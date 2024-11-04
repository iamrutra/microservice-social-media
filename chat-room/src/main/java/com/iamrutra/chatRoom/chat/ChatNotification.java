package com.iamrutra.chatRoom.chat;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatNotification {
    private String chatId;
    private int senderId;
    private int recipientId;
    private String content;
    private String file;
    private int id;
}
