package com.iamrutra.chatRoom.chat;

import com.iamrutra.chatRoom.bucket.BucketName;
import com.iamrutra.chatRoom.chatroom.ChatRoomService;
import com.iamrutra.chatRoom.fileStore.FileStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;
    private final FileStore fileStore;

    public ChatMessage save(ChatMessage chatMessage) {
        var chatId = chatRoomService.getChatRoomId(
                chatMessage.getSenderId(),
                chatMessage.getRecipientId(),
                true
        ).orElseThrow();

        chatMessage.setChatId(chatId);
        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> findChatMessages(
            int senderId,
            int recipientId
    ) {
        var chatId = chatRoomService.getChatRoomId(
                senderId,
                recipientId,
                false
        );
        return chatId.map(chatMessageRepository::findByChatId)
                .orElse(new ArrayList<>());
    }

    //public String uploadUserImage(int userId, MultipartFile file) {
    //        isFileEmpty(file);
    //        isImage(file);
    //        User user = userMapper.mapToUser(findById(userId));
    //
    //        Map<String, String> metadata = extractMetadata(file);
    //        String path = String.format("%s/%s", BucketName.PROFILE_IMAGE.getBucketName(), user.getId());
    //
    //        String originalFilename = file.getOriginalFilename();
    //        String extension = "";
    //        int i = originalFilename.lastIndexOf('.');
    //        if (i >= 0) {
    //            extension = originalFilename.substring(i);
    //            originalFilename = originalFilename.substring(0, i);
    //        }
    //
    //        String filename = String.format("%s%s", originalFilename, extension);
    //
    //        try {
    //            fileStore.save(path, filename, Optional.of(metadata), file.getInputStream());
    //
    //            user.setProfileImageLink(filename);
    //            userRepository.save(user);
    //
    //            return "Image uploaded successfully";
    //        } catch (IOException e) {
    //            throw new IllegalStateException("Failed to upload file", e);
    //        }
    //    }
    //
    //
    //    private void isFileEmpty(MultipartFile file) {
    //        if (file.isEmpty()) {
    //            throw new IllegalStateException("Cannot upload empty file [ " + file.getSize() + "]");
    //        }
    //    }
    //
    //    private void isImage(MultipartFile file) {
    //        if (!Arrays.asList(
    //                IMAGE_JPEG.getMimeType(),
    //                IMAGE_PNG.getMimeType(),
    //                IMAGE_GIF.getMimeType()
    //        ).contains(file.getContentType())) {
    //            throw new IllegalStateException("File must be an image [ " + file.getContentType() + "]");
    //        }
    //    }
    //
    //    private Map<String, String> extractMetadata(MultipartFile file) {
    //        Map<String, String> metadata = new HashMap<>();
    //        metadata.put("Content-Type", file.getContentType());
    //        metadata.put("Content-Length", String.valueOf(file.getSize()));
    //        return metadata;
    //    }
    //
    //    public byte[] downloadUserImage(int userId) {
    //        User user = userMapper.mapToUser(findById(userId));
    //        if (user.getProfileImageLink() == null) {
    //            throw new IllegalStateException("User does not have a profile image");
    //        }
    //
    //        String path = String.format("%s/%s", BucketName.PROFILE_IMAGE.getBucketName(), user.getId());
    //
    //        try {
    //            return fileStore.download(path, user.getProfileImageLink());
    //        } catch (AmazonS3Exception e) {
    //            throw new IllegalStateException("Failed to download file from S3", e);
    //        }
    //    }


    public String uploadFile(int messageId, MultipartFile file){
        isFileEmpty(file);
        ChatMessage chatMessage = chatMessageRepository.findById(messageId).get();

        Map<String, String> metadata = extractMetadata(file);

        String path = String.format("%s/%s", BucketName.FILE.getBucketName(), chatMessage.getId());
        String filename = file.getOriginalFilename();
        String extension = "";
        int i = filename.lastIndexOf('.');
        if (i >= 0) {
            extension = filename.substring(i);
            filename = filename.substring(0, i);
        }
        filename = String.format("%s%s", filename, extension);

        try {
            fileStore.save(path, filename, Optional.of(metadata), file.getInputStream());
            chatMessage.setFile(filename);
            chatMessageRepository.save(chatMessage);
            return "File uploaded successfully";
        } catch (Exception e) {
            throw new IllegalStateException("Failed to upload file", e);
        }
    }

    public byte[] downloadFile(int messageId){
        ChatMessage chatMessage = chatMessageRepository.findById(messageId).get();
        String path = String.format("%s/%s", BucketName.FILE.getBucketName(), chatMessage.getId());
        return fileStore.download(path, chatMessage.getFile());
    }

    private Map<String, String> extractMetadata(MultipartFile file) {
        return Map.of(
                "Content-Type", file.getContentType(),
                "Content-Length", String.valueOf(file.getSize())
        );
    }

    private void isFileEmpty(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalStateException("Cannot upload empty file [ " + file.getSize() + "]");
        }
    }
}
