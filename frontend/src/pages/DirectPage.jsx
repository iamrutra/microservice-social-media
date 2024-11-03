import React, {useEffect, useState, useRef} from 'react';
import {Stomp} from "@stomp/stompjs";
import SockJs from "sockjs-client";
import UserService from "../API/UserService";
import ChatRoomService from "../API/ChatRoomService";
import styles from '../styles/DirectPage.module.css';

const DirectPage = () => {

    const userId = localStorage.getItem('userId');
    console.log('User ID:', parseInt(userId));
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const jwtToken = localStorage.getItem('jwtToken');

    const messageFormRef = useRef(null);
    const chatAreaRef = useRef(null);
    const messageInput = document.getElementById('message');
    const stompClientRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const selectedUserRef = useRef(null);


    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        UserService.getUser(userId).then(response => {
            console.log('User:', response);
            setUser(response);
            setUsername(response.username);
            setFullName(response.fullName);
        });
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [userId]);

    useEffect(() => {
        console.log('Username+_+_+_+_+_+_+_+_+_+_+_+_+:', username);
        if (username) {
            connect();
        }
    }, [username]);

    useEffect(() => {
        if (selectedUserId) {
            console.log('Selected User ID has changed:', selectedUserId);
            fetchAndDisplayUserChat(selectedUserId).then();
        }
    }, [selectedUserId]);

    console.log('User:', user);
    console.log('Username:', username);
    console.log('Full Name:', fullName);


    const connect = () => {
        const socket = new SockJs(`http://localhost:8040/ws`);
        console.log('Socket:', socket);
        stompClientRef.current = Stomp.over(socket);
        stompClientRef.current.connect({}, onConnected, onError);
    }

    function onConnected() {
        stompClientRef.current.subscribe(`/user/${parseInt(userId)}/queue/messages`, onMessageReceived);
        stompClientRef.current.subscribe(`/topic/public`, onMessageReceived);

        stompClientRef.current.send(
            "/app/user.addUser",
            {},
            JSON.stringify({ id: parseInt(userId), username: username, fullName: fullName, status: 'ONLINE' })
        );
        findAndDisplayConnectedUsers().then();
    }

    async function findAndDisplayConnectedUsers() {
        const response = ChatRoomService.findAllConnectedUsers();
        let connectedUsers = await response;
        console.log('Connected Users:', connectedUsers);
        connectedUsers = connectedUsers.filter(user => user.username !== username);
        const connectedUsersList = document.getElementById('connectedUsers');
        connectedUsersList.innerHTML = '';
        connectedUsers.forEach((user, index) => {
            appendUserElement(user, connectedUsersList);
            if (index < connectedUsers.length - 1) {
                const separator = document.createElement('li');
                separator.classList.add(styles.separator);
                connectedUsersList.appendChild(separator);
            }
        });
    }

    function appendUserElement(user, connectedUsersList) {
        const listItem = document.createElement('li');


        listItem.classList.add(styles.userItem);
        listItem.id = user.id;

        const userImage = document.createElement('img');
        if (user.profileImageLink !== null) {
            console.log('User Image:', user.id);
            userImage.src = `http://localhost:8010/api/v1/users/${user.id}/image/download`;
            userImage.className = styles.profileImage;
        } else {
            userImage.src = 'http://localhost:8010/api/v1/users/defaultPfp/image/download';
            userImage.className = styles.profileImage;
        }
        userImage.alt = 'User Image';

        const userSpan = document.createElement('span');
        userSpan.textContent = user.fullName;

        const receivedMsgs = document.createElement('span');

        receivedMsgs.classList.add(styles.nbrMsg, styles.hidden);

        listItem.appendChild(userImage);
        listItem.appendChild(userSpan);
        listItem.appendChild(receivedMsgs);

        listItem.addEventListener('click', userItemClick);

        connectedUsersList.appendChild(listItem);
    }

    function userItemClick(event) {
        document.querySelectorAll('.user-item').forEach(item => {
            item.classList.remove(styles.active);
        });

        if (messageFormRef.current) {
            messageFormRef.current.classList.remove(styles.hidden);
        }

        const clickedUser = event.currentTarget;
        clickedUser.classList.add(styles.active);

        console.log('Clicked User:', clickedUser);
        setSelectedUserId(parseInt(clickedUser.id));
        selectedUserRef.current = parseInt(clickedUser.id);
    }

    async function fetchAndDisplayUserChat(selectedUserId) {
        console.log('Selected User ID:', selectedUserId);
        if (!chatAreaRef.current || !selectedUserId) return;

        const userIdNum = parseInt(userId, 10) || 0;
        const selectedUserIdNum = parseInt(selectedUserId, 10) || 0;

        if (!userIdNum || !selectedUserIdNum) {
            console.error('Invalid userId or selectedUserId');
            return;
        }

        try {
            const userChatResponse = await fetch(`http://localhost:8040/messages/${userIdNum}/${selectedUserIdNum}`);
            const userChat = await userChatResponse.json();
            console.log('User Chat:', userChat);
            chatAreaRef.current.innerHTML = '';
            userChat.forEach(chat => {
                displayMessage(chat.senderId, chat.content);
            });
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        } catch (error) {
            console.error('Error fetching user chat:', error);
        }
    }

    function displayMessage(senderId, content) {
        if (!chatAreaRef.current) return;
        const messageContainer = document.createElement('div');
        messageContainer.classList.add(styles.message, senderId === parseInt(userId) ? styles.sender : styles.receiver);
        const message = document.createElement('p');
        message.textContent = content;
        messageContainer.appendChild(message);
        chatAreaRef.current.appendChild(messageContainer);
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }

    function onError(error) {
        console.error('WebSocket connection error:', error);
    }

    function sendMessage(event) {
        event.preventDefault();

        const messageContent = messageInput.value.trim();
        console.log('Stomp Client:', stompClientRef.current);
        console.log(selectedUserId);
        if (messageContent && stompClientRef.current && selectedUserId) {
            const chatMessage = {
                senderId: parseInt(userId),
                recipientId: parseInt(selectedUserId),
                content: messageContent,
                timestamp: new Date()
            };
            console.log('Chat Message:', chatMessage);
            stompClientRef.current.send("/app/chat", {}, JSON.stringify(chatMessage));
            displayMessage(parseInt(userId), messageContent);
            messageInput.value = '';
            if (chatAreaRef.current) {
                chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
            }
        }

    }

    async function onMessageReceived(payload) {
        const message = JSON.parse(payload.body);
        console.log('Received Message:', message);
        const currentSelectedUserId = selectedUserRef.current;
        if (
            (message.senderId === currentSelectedUserId && message.recipientId === parseInt(userId)) ||
            (message.senderId === parseInt(userId) && message.recipientId === currentSelectedUserId)
        ) {
            displayMessage(message.senderId, message.content);
        }

        const notifiedUser = document.getElementById(message.senderId);
        if (notifiedUser && !notifiedUser.classList.contains('active')) {
            const nbrMsg = notifiedUser.querySelector('.nbr-msg');
            nbrMsg.classList.remove(styles.hidden);
            nbrMsg.textContent = '';
        }
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }




    return (
        <div>
            <div className={styles.chatContainer} id="chat-page">
                <div className={styles.usersList}>
                    <div className={styles.usersListContainer}>
                        <h2>Online Users</h2>
                        <ul id="connectedUsers"></ul>
                    </div>
                    <div>
                        <p id="connected-user-fullname"></p>
                    </div>
                </div>

                <div className={styles.chatArea}>
                    <div className={styles.chatMessages} ref={chatAreaRef} id="chat-messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`${styles.message} ${
                                    msg.senderId === parseInt(userId) ? styles.sender : styles.receiver
                                }`}
                            >
                                <p>{msg.content}</p>
                            </div>
                        ))}
                    </div>

                    <form id="messageForm" ref={messageFormRef} className={styles.hidden}>
                        <div className={styles.messageInput}>
                            <input autoComplete="off" type="text" id="message" placeholder="Type your message..." />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

    export default DirectPage;
