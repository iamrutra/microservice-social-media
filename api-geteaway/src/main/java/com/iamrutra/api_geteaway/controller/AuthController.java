package com.iamrutra.api_geteaway.controller;

import com.iamrutra.api_geteaway.dto.LoginRequest;
import com.iamrutra.api_geteaway.dto.RegisterRequest;
import com.iamrutra.api_geteaway.service.KeycloakService;
import com.iamrutra.api_geteaway.user.UserClient;
import com.iamrutra.api_geteaway.user.UserRep;
import lombok.RequiredArgsConstructor;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name = "ApiGateway Controller", description = "APIs for gateway management")
public class AuthController {

    private final KeycloakService keycloakService;

    private final UserClient userClient;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        String token = keycloakService.getKeycloakToken(username, password);

        if (token != null) {
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        boolean keycloakUserCreated = keycloakService.createUserInKeycloak(registerRequest, keycloakService.getAdminAccessToken());

        if (keycloakUserCreated) {
            UserRep newUser = new UserRep();
            newUser.setUsername(registerRequest.getUsername());
            newUser.setEmail(registerRequest.getEmail());
            newUser.setFullName(registerRequest.getFullName());
            newUser.setPassword(registerRequest.getPassword());
            newUser.setDateOfBirth(registerRequest.getDateOfBirth());
            newUser.setKeycloakId(keycloakService.getKeycloakId());
            userClient.saveUser(newUser);

            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register user in Keycloak");
        }
    }

    @GetMapping("adminToken")
    public ResponseEntity<?> getAdminToken() {
        return ResponseEntity.ok(keycloakService.getAdminAccessToken());
    }

}
