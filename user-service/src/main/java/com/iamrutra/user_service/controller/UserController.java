package com.iamrutra.user_service.controller;

import com.iamrutra.user_service.dto.User;
import com.iamrutra.user_service.dto.UserRequest;
import com.iamrutra.user_service.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("users")
@Tag(name = "User Controller", description = "APIs for user management")
public class UserController {

    private final UserService userService;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/getAll")
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @PostMapping("/register")
    public ResponseEntity<User> saveUser(@RequestBody UserRequest request) {
        return ResponseEntity.created(null).body(userService.saveUser(request));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{id}")
    public ResponseEntity<User> findUserById(@PathVariable("id") int id){
        return ResponseEntity.ok(userService.findById(id));
    }

}
