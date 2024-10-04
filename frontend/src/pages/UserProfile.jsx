import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import UserService from "../API/UserService";
import styles from '../styles/UserProfile.module.css';
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


    return (
        <div>
            {user ? (
                <div className={styles.userProfile}>
                    <div className={styles.user}>
                        {user.profileImageLink ? (
                            <img src={`http://localhost:8010/api/v1/users/${user.id}/image/download`} alt="User avatar" />
                        ) : <img src={`http://localhost:8010/api/v1/users/defaultPfp/image/download`} alt={"Default Picture For Profile"} />}
                        <h2>Username: {user.username}</h2>
                        <h3>Full Name: {user.fullName}</h3>
                        <h3>Date of Birth: {user.dateOfBirth}</h3>
                        <h3>Created at: {formatDate(user.createdAt)}</h3>
                    </div>

                    <div className={styles.posts}>
                        {posts.length > 0 ? (
                            posts.map(post => (
                                <div key={post.id} className={styles.post}>
                                    {post.postImage ? (
                                        <img className={styles.postImage}
                                             src={`http://localhost:8020/api/v1/posts/${post.id}/image/download`}
                                             alt="Post image"/>
                                    ) : null}
                                    <h3>{post.title}</h3>
                                    <p>{post.content}</p>
                                    <h5>Created at: {formatDate(post.createdAt)}</h5>
                                    <hr/>
                                </div>
                            ))) : <h3>No posts yet</h3>}
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserProfile;
