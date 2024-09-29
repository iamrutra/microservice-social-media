package com.iamrutra.api_geteaway.user;
import lombok.Getter;

import java.util.List;


@Getter
public class UserRep {
    private String id;
    private String username;
    private String email;
    private String fullName;
    private String password;
    private List<String> roles;
    private boolean isLocked;
    private boolean isEnabled;
}
