import React, {useEffect, useState} from 'react';
import {Stomp} from "@stomp/stompjs";
import SockJs from "sockjs-client";
import UserService from "../API/UserService";
import ChatRoomService from "../API/ChatRoomService";



const DirectPage = () => {

    const userId = localStorage.getItem('userId');
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const jwtToken = localStorage.getItem('jwtToken');
    console.log('JWT Token:', jwtToken);

    useEffect(() => {
        UserService.getUser(userId).then(response => {
            console.log('User:', response);
            setUser(response);
            setUsername(response.username);
            setFullName(response.fullName);
        });
        connect();
    }, [userId]);

    console.log('User:', user);
    console.log('Username:', username);
    console.log('Full Name:', fullName);
    let stompClient = null;



    const connect = () => {
        const socket = new SockJs(`http://localhost:8040/ws`);
        console.log('Socket:', socket);
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnected, onError);
    }

    function onConnected() {
        stompClient.subscribe(`/user/${username}/queue/messages`, onMessageReceived);
        stompClient.subscribe(`/user/public`, onMessageReceived);

        stompClient.send("/app/user.addUser",
            {},
            JSON.stringify({sender: username, fullName: fullName, status: 'ONLINE'})
            );
        findAndDisplayConnectedUsers().then();
    }

    async function findAndDisplayConnectedUsers() {
        const response = ChatRoomService.findAllConnectedUsers();
        let connectedUsers = await response.data;
        console.log('Connected Users:', connectedUsers);
    }

    function onError() {

    }

    function onMessageReceived() {

    }

    return (
        <div>

        </div>
    );
};

export default DirectPage;