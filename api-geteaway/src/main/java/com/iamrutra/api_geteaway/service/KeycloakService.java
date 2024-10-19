package com.iamrutra.api_geteaway.service;


import com.iamrutra.api_geteaway.controller.AuthController;
import com.iamrutra.api_geteaway.dto.RegisterRequest;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class KeycloakService {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    RestTemplate restTemplate = new RestTemplate();
    @Getter
    private String keycloakId;

    public String getKeycloakToken(String username, String password) {
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

    public boolean createUserInKeycloak(RegisterRequest userRequest, String adminToken) {
        String url = "http://localhost:8080/admin/realms/iamrutra/users";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(adminToken);

        // Создание тела запроса для пользователя
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("username", userRequest.getUsername());
        userMap.put("email", userRequest.getEmail());
        userMap.put("enabled", true);

        // Добавление кастомного атрибута "fullName"
        Map<String, Object> attributesMap = new HashMap<>();
        attributesMap.put("fullName", userRequest.getFullName());
        attributesMap.put("dateOfBirth", userRequest.getDateOfBirth().toString());

        // Добавляем атрибуты в тело запроса
        userMap.put("attributes", attributesMap);

        // Добавляем пароль в поле credentials
        Map<String, Object> credentialsMap = new HashMap<>();
        credentialsMap.put("type", "password");
        credentialsMap.put("value", userRequest.getPassword());
        credentialsMap.put("temporary", false);

        userMap.put("credentials", List.of(credentialsMap));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(userMap, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            String locationHeader = response.getHeaders().getLocation().toString();
            keycloakId = locationHeader.substring(locationHeader.lastIndexOf('/') + 1);
            log.info(keycloakId);
            return response.getStatusCode() == HttpStatus.CREATED;
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
        }

        return false;
    }

    public String getAdminAccessToken() {
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
