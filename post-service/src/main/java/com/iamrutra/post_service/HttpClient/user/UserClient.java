package com.iamrutra.post_service.HttpClient.user;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "user-client", url = "http://localhost:8010/api/v1/users")
public interface UserClient {
    @GetMapping("/{id}")
    public UserRep findUserById(@PathVariable("id") int id );
}
