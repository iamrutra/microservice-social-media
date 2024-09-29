package com.iamrutra.api_geteaway.user;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "user-client",
        url = "http://localhost:8010/api/v1/users"
)
public interface UserClient {
    @GetMapping("/{id}")
    public UserRep findUserById(@PathVariable("id") int id );


    @GetMapping("/username/{username}")
    public ResponseEntity<UserRep> getUserByUsername(@PathVariable("username") String username);
}
