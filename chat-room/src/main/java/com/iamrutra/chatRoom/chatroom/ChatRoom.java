package com.iamrutra.chatRoom.chatroom;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class ChatRoom {
    @Id
    private int id;
    private String chatId;
    private int senderId;
    private int recipientId;
}
