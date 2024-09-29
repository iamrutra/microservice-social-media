package com.iamrutra.user_service.controller;

import com.iamrutra.user_service.dto.User;
import com.iamrutra.user_service.dto.UserRequest;
import com.iamrutra.user_service.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("users")
@Tag(name = "User Controller", description = "APIs for user management")
public class UserController {

    private final UserService userService;

    @GetMapping("/getAll")
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @PostMapping("/register")
    public ResponseEntity<User> saveUser(@RequestBody UserRequest request) {
        return ResponseEntity.created(null).body(userService.saveUser(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> findUserById(@PathVariable("id") int id){
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

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("{userId}/image/download")
    public byte[] downloadUserImage(@PathVariable("userId") int userId) {
        return userService.downloadUserImage(userId);
    }

}
