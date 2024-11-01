package com.iamrutra.chatRoom.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserClient userClient;

    public void saveUser(User user) {
        user.setStatus(Status.ONLINE);
        userClient.updateUser(user.getId(), user);
    }
    public void disconnectUser(User user) {
        var storedUser = userClient.findUserById(user.getId());
        if(storedUser != null) {
            storedUser.setStatus(Status.OFFLINE);
            userClient.updateUser(user.getId(), storedUser);
        }
    }
    public List<User> findConnectedUsers() {
        return userClient.findConnectedUsers();
    }
}
