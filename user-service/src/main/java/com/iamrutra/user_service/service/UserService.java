package com.iamrutra.user_service.service;

import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.iamrutra.user_service.bucket.BucketName;
import com.iamrutra.user_service.dto.UserRequest;
import com.iamrutra.user_service.dto.UserResponse;
import com.iamrutra.user_service.fileStore.FileStore;
import com.iamrutra.user_service.mapper.UserMapper;
import com.iamrutra.user_service.dto.User;
import com.iamrutra.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

import static org.apache.http.entity.ContentType.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final FileStore fileStore;

    public Page<User> findAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User saveUser(UserRequest request) {
        User user = userMapper.mapToUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        user.setLocked(false);
        user.setRoles(List.of("USER"));
        user.setCreatedAt(LocalDateTime.now());
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

    public byte[] downloadDefaultPfp() {
        String path = String.format("%s/%s", BucketName.PROFILE_IMAGE.getBucketName(), "defaultPfp");
        try {
            return fileStore.download(path, "default-pfp.jpg");
        } catch (AmazonS3Exception e) {
            throw new IllegalStateException("Failed to download file from S3", e);
        }
    }

    public List<User> findByUsernameContaining(String username, int limit) {
        return userRepository.findByUsernameContainingIgnoreCase(username, PageRequest.of(0, limit));
    }

    public User followUser(int followerId, int followingId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new IllegalArgumentException("Follower user not found"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new IllegalArgumentException("User to follow not found"));

        if (!follower.getFollowing().contains(following)) {
            follower.getFollowing().add(following);

            following.getFollowers().add(follower);

            userRepository.save(follower);
            userRepository.save(following);
        }

        return follower;
    }

    public Boolean isFollowing(int followerId, int followingId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new IllegalArgumentException("Follower user not found"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new IllegalArgumentException("User to follow not found"));

        return follower.getFollowing().contains(following);
    }

    public User unfollowUser(int followerId, int followingId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new IllegalArgumentException("Follower user not found"));

        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new IllegalArgumentException("User to follow not found"));

        if (follower.getFollowing().contains(following)) {
            follower.getFollowing().remove(following);

            following.getFollowers().remove(follower);

            userRepository.save(follower);
            userRepository.save(following);
        }

        return follower;
    }


    public List<UserResponse> getFollowers(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return userMapper.mapToUserResponseList(user.getFollowers());
    }

    public List<UserResponse> getFollowing(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return userMapper.mapToUserResponseList(user.getFollowing());
    }
}

