package com.iamrutra.api_geteaway.user;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Getter
@Setter
public class UserRep {
    private String id;
    private String keycloakId;
    private String username;
    private String email;
    private String fullName;
    private String password;
    private LocalDate dateOfBirth;
    private List<String> roles;
    private boolean isLocked;
    private boolean isEnabled;
}
