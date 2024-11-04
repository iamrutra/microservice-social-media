package com.iamrutra.chatRoom.chat;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;

    @CrossOrigin(origins = "http://localhost:3000")
    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMsg = chatMessageService.save(chatMessage);
        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessage.getRecipientId()),
                "/queue/messages",
                ChatNotification.builder()
                        .senderId(savedMsg.getSenderId())
                        .recipientId(savedMsg.getRecipientId())
                        .content(savedMsg.getContent())
                        .file(savedMsg.getFile())
                        .id(savedMsg.getId())
                        .build()
        );
        log.info("Message ID: " + savedMsg.getId());
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(
            @PathVariable("senderId") int senderId,
            @PathVariable("recipientId") int recipientId
    ) {
        return ResponseEntity.ok(chatMessageService.findChatMessages(senderId, recipientId));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(
            path = "/{messageId}/file/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<String> uploadFile(@PathVariable("messageId") int messageId,
                                                  @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(chatMessageService.uploadFile(messageId, file));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{messageId}/file/download")
    public byte[] downloadFile(@PathVariable("messageId") int messageId) {
        return chatMessageService.downloadFile(messageId);
    }

}
