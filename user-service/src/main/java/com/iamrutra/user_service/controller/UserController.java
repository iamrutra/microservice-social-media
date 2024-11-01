package com.iamrutra.user_service.controller;

import com.iamrutra.user_service.dto.User;
import com.iamrutra.user_service.dto.UserRequest;
import com.iamrutra.user_service.dto.UserResponse;
import com.iamrutra.user_service.service.RequestCounterService;
import com.iamrutra.user_service.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

import static org.hibernate.query.sqm.tree.SqmNode.log;

@RestController
@RequiredArgsConstructor
@RequestMapping("users")
@Tag(name = "User Controller", description = "APIs for user management")
public class UserController {

    private final UserService userService;
    private final RequestCounterService requestCounterService;

    @GetMapping("/getAll")
    public Page<User> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "false") boolean ascending
    ) {
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return userService.findAllUsers(pageable);
    }

    @PostMapping("/register")
    public ResponseEntity<User> saveUser(@RequestBody UserRequest request) {
        return ResponseEntity.created(null).body(userService.saveUser(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> findUserById(@PathVariable("id") int id){
        int requestCount = requestCounterService.incrementRequestCount(id);

        if (requestCount > 100) {
            log.info("Request from cache");
            return findUserByIdCached(id);
        }

        log.info("Request from db");
        return ResponseEntity.ok(userService.findById(id));
    }

    @Cacheable(value = "userCache", key = "#id", unless = "#requestCounterService.incrementRequestCount(#id) <= 100")
    public ResponseEntity<User> findUserByIdCached(int id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable("username") String username) {
        return ResponseEntity.ok(userService.findByUsername(username));
    }

    @PostMapping(
            path = "/{userId}/image/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<String> uploadUserImage(@PathVariable("userId") int userId,
                                                  @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userService.uploadUserImage(userId, file));
    }

    @GetMapping("{userId}/image/download")
    public byte[] downloadUserImage(@PathVariable("userId") int userId) {
        return userService.downloadUserImage(userId);
    }

    @GetMapping("defaultPfp/image/download")
    public byte[] downloadDefaultPfp() {
        return userService.downloadDefaultPfp();
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam(required = false) String username) {
        if (username == null || username.isEmpty()) {
            return Collections.emptyList();
        }
        return userService.findByUsernameContaining(username, 10);
    }

    @PostMapping("/follow/{followerId}/{followingId}")
    public ResponseEntity<User> followUser(@PathVariable("followerId") int followerId,
                                           @PathVariable("followingId") int followingId) {
        return ResponseEntity.ok(userService.followUser(followerId, followingId));
    }

    @GetMapping("/isFollowing/{followerId}/{followingId}")
    public ResponseEntity<Boolean> isFollowing(@PathVariable("followerId") int followerId,
                                               @PathVariable("followingId") int followingId) {
        return ResponseEntity.ok(userService.isFollowing(followerId, followingId));
    }

    @PostMapping("/unfollow/{followerId}/{followingId}")
    public ResponseEntity<User> unfollowUser(@PathVariable("followerId") int followerId,
                                             @PathVariable("followingId") int followingId) {
        return ResponseEntity.ok(userService.unfollowUser(followerId, followingId));
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<UserResponse>> getFollowers(@PathVariable("userId") int userId) {
        return ResponseEntity.ok(userService.getFollowers(userId));
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<UserResponse>> getFollowing(@PathVariable("userId") int userId) {
        return ResponseEntity.ok(userService.getFollowing(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") int id, @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @GetMapping("/findConnectedUsers")
    public List<User> findConnectedUsers() {
        return userService.findConnectedUsers();
    }
}
