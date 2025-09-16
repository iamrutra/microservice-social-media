import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Stomp } from "@stomp/stompjs";
import SockJs from "sockjs-client";
import UserService from "../API/UserService";
import ChatRoomService from "../API/ChatRoomService";
import styles from '../styles/DirectPage.module.css';
import ChatImageDropzone from "../components/ChatImageDropzone";

const DirectPage = () => {
    const { id } = useParams(); // Get the user ID from the URL
    const userId = localStorage.getItem('userId');
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const jwtToken = localStorage.getItem('jwtToken');

    const messageFormRef = useRef(null);
    const chatAreaRef = useRef(null);
    const messageInputRef = useRef(null);
    const stompClientRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const selectedUserRef = useRef(null);
    const [selectedUserId, setSelectedUserId] = useState(parseInt(id)); // Set from URL param

    useEffect(() => {
        UserService.getUser(userId).then(response => {
            setUser(response);
            setUsername(response.username);
            setFullName(response.fullName);
        });
    }, [userId]);

    useEffect(() => {
        if (username) {
            connect();
        }

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
            }
        };
    }, [username]);

    useEffect(() => {
        if (selectedUserId) {
            fetchAndDisplayUserChat(selectedUserId);
            selectedUserRef.current = selectedUserId;
            if (messageFormRef.current) {
                messageFormRef.current.classList.remove(styles.hidden);
            }
        }
    }, [selectedUserId]);

    const connect = () => {
        const socket = new SockJs(`http://localhost:8040/ws`);
        stompClientRef.current = Stomp.over(socket);
        stompClientRef.current.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        stompClientRef.current.subscribe(`/user/${parseInt(userId)}/queue/messages`, onMessageReceived);
        stompClientRef.current.subscribe(`/topic/public`, onMessageReceived);

        stompClientRef.current.send(
            "/app/user.addUser",
            {},
            JSON.stringify({ id: parseInt(userId), username: username, fullName: fullName, status: 'ONLINE' })
        );
        findAndDisplayConnectedUsers();
    };

    const findAndDisplayConnectedUsers = async () => {
        const connectedUsers = await ChatRoomService.findAllConnectedUsers();
        const filteredUsers = connectedUsers.filter(user => user.username !== username);
        const connectedUsersList = document.getElementById('connectedUsers');
        connectedUsersList.innerHTML = '';
        filteredUsers.forEach((user, index) => {
            appendUserElement(user, connectedUsersList);
            if (index < filteredUsers.length - 1) {
                const separator = document.createElement('li');
                separator.classList.add(styles.separator);
                connectedUsersList.appendChild(separator);
            }
        });
    };

    const appendUserElement = (user, connectedUsersList) => {
        const listItem = document.createElement('li');
        listItem.classList.add(styles.userItem);
        listItem.id = user.id;

        const userImage = document.createElement('img');
        userImage.src = user.profileImageLink
            ? `http://localhost:8010/api/v1/users/${user.id}/image/download`
            : 'http://localhost:8010/api/v1/users/defaultPfp/image/download';
        userImage.className = styles.profileImage;
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

        // Highlight the user from URL param
        if (parseInt(user.id) === selectedUserId) {
            listItem.classList.add(styles.active);
        }
    };

    const userItemClick = (event) => {
        const clickedUser = event.currentTarget;
        setSelectedUserId(parseInt(clickedUser.id));
        selectedUserRef.current = parseInt(clickedUser.id);
        if (clickedUser.querySelector(`.${styles.nbrMsg}`)) {
            clickedUser.querySelector(`.${styles.nbrMsg}`).classList.add(styles.hidden);
        }

        document.querySelectorAll(`.${styles.userItem}`).forEach(item => {
            item.classList.remove(styles.active);
        });
        clickedUser.classList.add(styles.active);

        if (messageFormRef.current) {
            messageFormRef.current.classList.remove(styles.hidden);
        }
    };

    const fetchAndDisplayUserChat = async (selectedUserId) => {
        const userIdNum = parseInt(userId, 10);
        const selectedUserIdNum = parseInt(selectedUserId, 10);

        if (!chatAreaRef.current || !userIdNum || !selectedUserIdNum) return;

        try {
            const userChatResponse = await fetch(`http://localhost:8040/messages/${userIdNum}/${selectedUserIdNum}`);
            const userChat = await userChatResponse.json();
            chatAreaRef.current.innerHTML = '';
            userChat.forEach(chat => {
                displayMessage(chat.senderId, chat.content);
            });
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        } catch (error) {
            console.error('Error fetching user chat:', error);
        }
    };

    const displayMessage = (senderId, content) => {
        if (!chatAreaRef.current) return;

        const messageContainer = document.createElement('div');
        messageContainer.classList.add(styles.message, senderId === parseInt(userId) ? styles.sender : styles.receiver);

        const message = document.createElement('p');
        message.textContent = content;

        messageContainer.appendChild(message);
        chatAreaRef.current.appendChild(messageContainer);
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    };

    const onError = (error) => {
        console.error('WebSocket connection error:', error);
    };

    const sendMessage = async (event) => {
        event.preventDefault();
        const messageContent = messageInputRef.current.value.trim();

        if (messageContent && stompClientRef.current && selectedUserId) {
            const chatMessage = {
                senderId: parseInt(userId),
                recipientId: parseInt(selectedUserId),
                content: messageContent,
                file: selectedFile ? selectedFile.name : null,
                timestamp: new Date()
            };

            stompClientRef.current.send("/app/chat", {}, JSON.stringify(chatMessage));
            displayMessage(parseInt(userId), messageContent);
            messageInputRef.current.value = '';
            setSelectedFile(null);
        }
    };

    const onMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        const currentSelectedUserId = selectedUserRef.current;

        if (
            (message.senderId === currentSelectedUserId && message.recipientId === parseInt(userId)) ||
            (message.senderId === parseInt(userId) && message.recipientId === currentSelectedUserId)
        ) {
            displayMessage(message.senderId, message.content);

            if (selectedFile && message.id) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                fetch(`http://localhost:8040/${message.id}/file/upload`, {
                    method: "POST",
                    body: formData,
                    headers: { Authorization: `Bearer ${jwtToken}` }
                })
                    .then(() => {
                        alert("File uploaded successfully");
                        setSelectedFile(null);
                    })
                    .catch(err => console.error("Upload error:", err));
            }
        }

        const notifiedUser = document.getElementById(message.senderId);
        if (notifiedUser && !notifiedUser.classList.contains(styles.active)) {
            const nbrMsg = notifiedUser.querySelector(`.${styles.nbrMsg}`);
            nbrMsg.classList.remove(styles.hidden);
            nbrMsg.textContent = '';
        }
    };

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

                    <form id="messageForm" ref={messageFormRef} className={selectedUserId ? '' : styles.hidden}>
                        <div className={styles.messageInput}>
                            <input
                                ref={messageInputRef}
                                autoComplete="off"
                                type="text"
                                id="message"
                                placeholder="Type your message..."
                            />
                            {/* <ChatImageDropzone onFileSelected={setSelectedFile} /> */}
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    </form>
                    {selectedFile && <p>Выбран файл: {selectedFile.name}</p>}
                </div>
            </div>
        </div>
    );
};

export default DirectPage;