import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import UserService from "../API/UserService";
import styles from '../styles/UserProfile.module.css';
import {useDropzone} from "react-dropzone";
import axios from "axios";
import PostService from "../API/PostService";

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await UserService.getUser(id);
                setUser(userData);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
            }
        };

        const fetchPosts = async () => {
            try {
                const postsData = await PostService.getPostsByUserId(id);
                console.log(postsData);
                setPosts(postsData.content);
            } catch (error) {
                console.error('Ошибка при получении данных постов пользователя:', error);
            }
        };

        fetchUser();
        fetchPosts();
    }, [id]);

    function formatDate(date) {
        const d = new Date(date);
        const day = d.getDate(); // Получаем день месяца
        const month = d.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
        const year = d.getFullYear();
        const hours = d.getHours();
        const minutes = d.getMinutes();

        // Форматируем строку, добавляя нули для однозначных чисел
        return `
        ${day < 10 ? "0" + day : day}.${month < 10 ? "0" + month : month}.${year} 
        ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}
    `;
    }


    return (
        <div>
            <UserProfileDropzone userProfileId={id} />
            {user ? (
                <div className={styles.userProfile}>
                    <div className={styles.user}>
                        {user.profileImageLink ? (
                            <img src={`http://localhost:8010/api/v1/users/${user.id}/image/download`} alt="User avatar" />
                        ) : null}
                        <h2>Username: {user.username}</h2>
                        <h3>Full Name: {user.fullName}</h3>
                        <h3>Date of Birth: {user.dateOfBirth}</h3>
                        <h3>Created at: {formatDate(user.createdAt)}</h3>
                    </div>

                    <div className={styles.posts}>
                        {posts.map(post => (
                            <div key={post.id} className={styles.post}>
                                {post.postImage ? (
                                    <img className={styles.postImage} src={`http://localhost:8020/api/v1/posts/${post.id}/image/download`} alt="Post image" />
                                ) : (
                                    <PostImageDropzone postId={post.id} />
                                )}
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                                <h5>Created at: {formatDate(post.createdAt)}</h5>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

function UserProfileDropzone({userProfileId}) {
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        axios.post(`http://localhost:8222/api/v1/users/${userProfileId}/image/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
                }
            }
        ).then(() => {
            console.log("file uploaded successfully");
        }).catch(err => {
            console.log(err);
        })
    }, [userProfileId]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    );
}

function PostImageDropzone({postId}) {
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        axios.post(`http://localhost:8222/api/v1/posts/${postId}/image/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
                }
            }
        ).then(() => {
            console.log("file uploaded successfully");
            // Здесь можно обновить список постов или что-то еще
        }).catch(err => {
            console.log(err);
        })
    }, [postId]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    );
}

export default UserProfile;
