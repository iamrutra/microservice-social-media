package com.iamrutra.api_geteaway.controller;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.net.URL;
import java.text.ParseException;

@RestController
@RequestMapping("auth")
public class TokenValidationController {

    @GetMapping("/validateToken")
    public ResponseEntity<?> isTokenValid(@RequestHeader("Authorization") String authorizationHeader)
            throws ParseException, MalformedURLException, JOSEException {
        String token = authorizationHeader.replace("Bearer ", "");

        // URL для получения публичных ключей (JWK) из Keycloak
        String jwkSetUrl = "http://localhost:8080/realms/iamrutra/protocol/openid-connect/certs";

        // Процессор JWT
        ConfigurableJWTProcessor<SecurityContext> jwtProcessor = new DefaultJWTProcessor<>();

        // Источник JWK (публичные ключи)
        JWKSource<SecurityContext> keySource = new RemoteJWKSet<>(new URL(jwkSetUrl));

        // Селектор ключей для проверки подписи
        JWSVerificationKeySelector<SecurityContext> keySelector = new JWSVerificationKeySelector<>(
                JWSAlgorithm.RS256, keySource);

        // Устанавливаем селектор ключей
        jwtProcessor.setJWSKeySelector(keySelector);

        // Обрабатываем и проверяем токен
        JWTClaimsSet claimsSet;
        try {
            claimsSet = jwtProcessor.process(token, null);
            System.out.println("Claims: " + claimsSet.toJSONObject());
            return ResponseEntity.ok(claimsSet.toJSONObject());
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token: " + e.getMessage());
        }
    }
}
