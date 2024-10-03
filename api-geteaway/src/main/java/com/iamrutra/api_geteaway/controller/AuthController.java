package com.iamrutra.api_geteaway.controller;

import com.iamrutra.api_geteaway.dto.LoginRequest;
import com.iamrutra.api_geteaway.dto.RegisterRequest;
import com.iamrutra.api_geteaway.user.UserClient;
import com.iamrutra.api_geteaway.user.UserRep;
import lombok.RequiredArgsConstructor;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("auth")
@RequiredArgsConstructor
@Tag(name = "ApiGateway Controller", description = "APIs for gateway management")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    private final UserClient userClient;
    RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();
        String token = getKeycloakToken(username, password);

        if (token != null) {
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        boolean keycloakUserCreated = createUserInKeycloak(registerRequest, getAdminAccessToken());

        if (keycloakUserCreated) {
            UserRep newUser = new UserRep();
            newUser.setUsername(registerRequest.getUsername());
            newUser.setEmail(registerRequest.getEmail());
            newUser.setFullName(registerRequest.getFullName());
            newUser.setPassword(registerRequest.getPassword());
            newUser.setRoles(List.of("USER"));
            userClient.saveUser(registerRequest);

            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register user in Keycloak");
        }
    }

    private String getKeycloakToken(String username, String password) {
        String url = "http://localhost:8080/realms/iamrutra/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", "springboot-keycloak");
        body.add("username", username);
        body.add("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return (String) response.getBody().get("access_token");
        }

        return null;
    }

    private boolean createUserInKeycloak(RegisterRequest userRequest, String adminToken) {
        String url = "http://localhost:8080/admin/realms/iamrutra/users";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);

        // Создание тела запроса для пользователя
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("username", userRequest.getUsername());
        userMap.put("email", userRequest.getEmail());
        userMap.put("enabled", true);

        // Добавляем пароль в поле credentials
        Map<String, Object> credentialsMap = new HashMap<>();
        credentialsMap.put("type", "password");
        credentialsMap.put("value", userRequest.getPassword());  // Из userRequest нужно получать пароль
        credentialsMap.put("temporary", false);  // false означает, что пароль постоянный

        userMap.put("credentials", List.of(credentialsMap));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(userMap, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            return response.getStatusCode() == HttpStatus.CREATED;
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
        }

        return false;
    }

    private String getAdminAccessToken() {
        // Get an admin token using the client credentials grant type
        String url = "http://localhost:8080/realms/iamrutra/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", "springboot-keycloak");
        body.add("username", "root");
        body.add("password", "root");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return (String) response.getBody().get("access_token");
        }

        return null;
    }
}
