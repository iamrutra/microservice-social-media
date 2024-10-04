import React, {useCallback, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import UserService from "../API/UserService";
import styles from '../styles/MyProfile.module.css';
import {useDropzone} from "react-dropzone";
import axios from "axios";
import PostService from "../API/PostService";

const MyProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchUser = async () => {
            if(userId !== id) {
                window.history.back();
            }
            else {
                try {
                    const userData = await UserService.getUser(id);
                    setUser(userData);
                } catch (error) {
                    console.error('Ошибка при получении данных пользователя:', error);
                }
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
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        const hours = d.getHours();
        const minutes = d.getMinutes();

        return `
        ${day < 10 ? "0" + day : day}.${month < 10 ? "0" + month : month}.${year} 
        ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}
    `;
    }

    function PostImageDropzone({ postId }) {
        const onDrop = useCallback(acceptedFiles => {
            setSelectedFile(acceptedFiles[0]);
        }, []);

        const { getRootProps, getInputProps } = useDropzone({ onDrop });

        const handleUpload = () => {
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

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
                }).catch(err => {
                    console.log(err);
                });
            }
        };

        return (
            <div>
                <div {...getRootProps()} className={styles.dropzone}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                {selectedFile && <button onClick={handleUpload}>Upload Post Image</button>}
            </div>
        );
    }

    function UserProfileDropzone({ userProfileId }) {
        const onDrop = useCallback(acceptedFiles => {
            setSelectedFile(acceptedFiles[0]);
        }, []);

        const { getRootProps, getInputProps } = useDropzone({ onDrop });

        const handleUpload = () => {
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

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
                });
            }
        };

        return (
            <div>
                <div {...getRootProps()} className={styles.dropzone}>
                    <input {...getInputProps()} />
                    <input type={"button"} value={"Change image"}></input>
                </div>
                {selectedFile ? handleUpload() : null}
            </div>
        );
    }

    return (
        <div>
            {user ? (

                <div className={styles.userProfile}>

                    <div className={styles.user}>
                        {user && user.profileImageLink ? (
                            <img
                                className={styles.profileImage}
                                src={`http://localhost:8010/api/v1/users/${user.id}/image/download`}
                                alt="User avatar"
                            />
                        ) : (
                            <img
                                className={styles.profileImage}
                                src={`http://localhost:8010/api/v1/users/defaultPfp/image/download`}
                                alt="Default Picture For Profile"
                            />
                        )}
                        <UserProfileDropzone userProfileId={id} />
                        <h2>Username: {user.username}</h2>
                        <h3>Full Name: {user.fullName}</h3>
                        <h3>Date of Birth: {user.dateOfBirth}</h3>
                        <h3>Created at: {formatDate(user.createdAt)}</h3>
                    </div>

                    <div className={styles.posts}>
                        {posts.map(post => (
                            <div key={post.id} className={styles.post}>
                                {post.postImage ? (
                                    <img
                                        className={styles.postImage}
                                        src={`http://localhost:8020/api/v1/posts/${post.id}/image/download`}
                                        alt="Post image"
                                    />
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

export default MyProfile;
