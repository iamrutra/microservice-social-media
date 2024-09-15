package com.iamrutra.user_service.controller;

import com.iamrutra.user_service.dto.User;
import com.iamrutra.user_service.dto.UserRequest;
import com.iamrutra.user_service.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

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
    public User saveUser(@RequestBody UserRequest request) {
        return userService.saveUser(request);
    }

    @GetMapping("/{id}")
    public Optional<User> findUserById(@PathVariable("id") int id){
        return userService.findById(id);
    }

}
