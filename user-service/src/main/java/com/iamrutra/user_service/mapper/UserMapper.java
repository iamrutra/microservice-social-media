package com.iamrutra.user_service.mapper;

import com.iamrutra.user_service.dto.UserRequest;
import com.iamrutra.user_service.dto.User;
import com.iamrutra.user_service.dto.UserResponse;
import org.springframework.stereotype.Component;

import java.util.List;

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

    public List<UserResponse> mapToUserResponseList(List<User> followers) {
        return followers.stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .dateOfBirth(user.getDateOfBirth())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .profileImageLink(user.getProfileImageLink())
//                .following(user.following())
//                .followers(user.followers())
                .roles(user.getRoles())
                .isLocked(user.isLocked())
                .isEnabled(user.isEnabled())
                .build();
    }
}
