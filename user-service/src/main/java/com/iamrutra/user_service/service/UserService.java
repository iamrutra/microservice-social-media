package com.iamrutra.user_service.service;

import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.iamrutra.user_service.bucket.BucketName;
import com.iamrutra.user_service.dto.UserRequest;
import com.iamrutra.user_service.fileStore.FileStore;
import com.iamrutra.user_service.mapper.UserMapper;
import com.iamrutra.user_service.dto.User;
import com.iamrutra.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

import static org.apache.http.entity.ContentType.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final FileStore fileStore;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(UserRequest request) {
        User user = userMapper.mapToUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        user.setLocked(false);
        user.setRoles(Collections.singletonList("ROLE_USER"));
        return userRepository.save(user);
    }

    public User findById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String uploadUserImage(int userId, MultipartFile file) {
        isFileEmpty(file);
        isImage(file);
        User user = findById(userId);

        Map<String, String> metadata = extractMetadata(file);
        String path = String.format("%s/%s", BucketName.PROFILE_IMAGE.getBucketName(), user.getId());

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        int i = originalFilename.lastIndexOf('.');
        if (i >= 0) {
            extension = originalFilename.substring(i);
            originalFilename = originalFilename.substring(0, i);
        }

        String filename = String.format("%s%s", originalFilename, extension);

        try {
            fileStore.save(path, filename, Optional.of(metadata), file.getInputStream());

            user.setProfileImageLink(filename);
            userRepository.save(user);

            return "Image uploaded successfully";
        } catch (IOException e) {
            throw new IllegalStateException("Failed to upload file", e);
        }
    }


    private void isFileEmpty(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalStateException("Cannot upload empty file [ " + file.getSize() + "]");
        }
    }

    private void isImage(MultipartFile file) {
        if (!Arrays.asList(
                IMAGE_JPEG.getMimeType(),
                IMAGE_PNG.getMimeType(),
                IMAGE_GIF.getMimeType()
        ).contains(file.getContentType())) {
            throw new IllegalStateException("File must be an image [ " + file.getContentType() + "]");
        }
    }

    private Map<String, String> extractMetadata(MultipartFile file) {
        Map<String, String> metadata = new HashMap<>();
        metadata.put("Content-Type", file.getContentType());
        metadata.put("Content-Length", String.valueOf(file.getSize()));
        return metadata;
    }

    public byte[] downloadUserImage(int userId) {
        User user = findById(userId);
        if (user.getProfileImageLink() == null) {
            throw new IllegalStateException("User does not have a profile image");
        }

        String path = String.format("%s/%s", BucketName.PROFILE_IMAGE.getBucketName(), user.getId());

        try {
            return fileStore.download(path, user.getProfileImageLink());
        } catch (AmazonS3Exception e) {
            throw new IllegalStateException("Failed to download file from S3", e);
        }
    }


    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

