package com.iamrutra.user_service.repository;

import com.iamrutra.user_service.dto.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);

    Page<User> findByUsernameContaining(String username, Pageable pageable);

    List<User> findAllByStatus(String status);

}
