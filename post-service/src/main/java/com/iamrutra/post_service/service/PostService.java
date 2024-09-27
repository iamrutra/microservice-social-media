package com.iamrutra.post_service.service;

import com.iamrutra.post_service.bucket.BucketName;
import com.iamrutra.post_service.fileStore.FileStore;
import com.iamrutra.post_service.mapper.PostMapper;
import com.iamrutra.post_service.model.Post;
import com.iamrutra.post_service.model.PostRequest;
import com.iamrutra.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

import static org.apache.http.entity.ContentType.*;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final FileStore fileStore;

    public Integer createPost(PostRequest request) {
        Post post = postMapper.mapToPost(request);
        return postRepository.save(post).getId();
    }

    public Page<Post> getPostsByUserId(Integer userId, Pageable pageable) {
        return postRepository.findAllByUserId(userId, pageable);
    }

    public Post getPostById(Integer postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post with id " + postId + " not found"));
    }

    public String deletePostById(int id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Post with id " + id + " not found");
        }
        postRepository.deleteById(id);
        return "Post deleted successfully";
    }

    public String uploadPostImage(int postId, MultipartFile file) {

        isFileEmpty(file);
        isImage(file);
        Post post = getPostById(postId);

        Map<String, String> metadata = extractMetadata(file);
        String path = String.format("%s/%s", BucketName.PROFILE_IMAGE.getBucketName(), post.getId());
        String filename = file.getOriginalFilename();

        try {
            fileStore.save(path, filename, Optional.of(metadata), file.getInputStream());

            post.setPostImage(filename);
            postRepository.save(post);

            return String.format("Image uploaded successfully for post %s", post.getId());
        } catch (IOException e) {
            throw new IllegalStateException("Failed to upload image", e);
        }
    }

    public byte[] downloadPostImage(int postId) {
        Post post = getPostById(postId);
        if (post.getPostImage() == null) {
            throw new IllegalStateException("Post does not have an image");
        }

        String path = String.format("%s/%s", BucketName.PROFILE_IMAGE.getBucketName(), post.getId());

        try {
            return fileStore.download(path, post.getPostImage());
        } catch (Exception e) {
            throw new IllegalStateException("Failed to download image", e);
        }
    }

    private static Map<String, String> extractMetadata(MultipartFile file) {
        Map<String, String> metadata = new HashMap<>();
        metadata.put("Content-Type", file.getContentType());
        metadata.put("Content-Length", String.valueOf(file.getSize()));
        return metadata;
    }

    private static void isImage(MultipartFile file) {
        if (!Arrays.asList(IMAGE_JPEG.getMimeType(), IMAGE_PNG.getMimeType(), IMAGE_GIF.getMimeType())
                .contains(file.getContentType())) {
            throw new RuntimeException("File must be an image [" + file.getContentType() + "]");
        }
    }

    private static void isFileEmpty(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload empty file [" + file.getSize() + "]");
        }
    }
}

