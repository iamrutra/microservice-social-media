package com.iamrutra.chatRoom.chat;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ChatMessage {
    @Id
    private int id;
    private String chatId;
    private int senderId;
    private int recipientId;
    private String content;
    private Date timestamp;
}
