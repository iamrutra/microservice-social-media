package com.iamrutra.chatRoom.user;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {
    private int id;
    private String username;
    private String fullName;
    private String status;
}
