package com.iamrutra.api_geteaway.controller;

import com.iamrutra.api_geteaway.dto.LoginRequest;
import com.iamrutra.api_geteaway.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Authenticate user and generate JWT token
        String token = jwtService.authenticate(loginRequest);
        if (token != null) {
            return ResponseEntity.ok(token);  // Return token if authentication is successful
        }
        return ResponseEntity.status(401).body("Unauthorized");
    }
}
