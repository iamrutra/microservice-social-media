package com.iamrutra.api_geteaway.service;

import com.iamrutra.api_geteaway.user.UserClient;
import com.iamrutra.api_geteaway.user.UserRep;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(MyUserDetailsService.class);
    private final UserClient userClient;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserRep user = userClient.getUserByUsername(username).getBody();
        log.info("User fetched: {}", user);
        // This is a dummy user; replace this with actual user fetching logic (e.g., from DB)
        if (username.equals(user.getUsername())) {
            return org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                    .password(new BCryptPasswordEncoder().encode(user.getPassword())) // password encoding
                    .authorities(user.getRoles().get(0))
                    .build();
        } else {
            throw new UsernameNotFoundException("User not found");
        }
    }
}
