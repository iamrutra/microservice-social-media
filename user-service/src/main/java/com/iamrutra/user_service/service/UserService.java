package com.iamrutra.user_service.service;

import com.iamrutra.user_service.dto.UserRequest;
import com.iamrutra.user_service.mapper.UserMapper;
import com.iamrutra.user_service.dto.User;
import com.iamrutra.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User saveUser(UserRequest request) {
        User user = userMapper.mapToUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(true);
        user.setLocked(false);
        user.setRole("USER");
        return userRepository.save(user);
    }

    public User findById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}

