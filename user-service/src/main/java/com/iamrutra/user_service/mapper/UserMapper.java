package com.iamrutra.user_service.mapper;

import com.iamrutra.user_service.dto.UserRequest;
import com.iamrutra.user_service.dto.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public User mapToUser(UserRequest request) {
        return User.builder()
                .id(request.id())
                .username(request.username())
                .email(request.email())
                .password(request.password())
                .dateOfBirth(request.dateOfBirth())
                .fullName(request.fullName())
                .build();
    }
}
