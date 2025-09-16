package com.iamrutra.chatRoom.user;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "user-client", url = "http://localhost:8010/api/v1/users")
public interface UserClient {

    @GetMapping("/{id}")
    public User findUserById(@PathVariable("id") int id );

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable("id") int id, @RequestBody User request);

    @GetMapping("/findConnectedUsers")
    public List<User> findConnectedUsers();
}
