import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import UserService from "../API/UserService";
import styles from '../styles/MyProfile.module.css';
import { useDropzone } from "react-dropzone";
import axios from "axios";
import PostService from "../API/PostService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as filledHeart} from '@fortawesome/free-solid-svg-icons';
import {faComment, faHeart as outlinedHeart} from '@fortawesome/free-regular-svg-icons';

const MyProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [selectedPostFile, setSelectedPostFile] = useState(null);
    const [selectedProfileFile, setSelectedProfileFile] = useState(null);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const userId = localStorage.getItem('userId');
    const [commentsByPostId, setCommentsByPostId] = useState({});
    const [commentators, setCommentators] = useState({});
    const [openComments, setOpenComments] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            if (userId !== id) {
                window.history.back();
            } else {
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
                setPosts(postsData.content);
            } catch (error) {
                console.error('Ошибка при получении данных постов пользователя:', error);
            }
        };

        fetchUser();
        fetchPosts();
    }, [id]);

    const fetchComments = async (postId) => { // NOT MINE PEACE OF CODE!!! I JUST ADDED THIS FUNCTION, its works and god thanks for that
        try {
            const commentsData = await PostService.getAllCommentsByPostId(postId);
            console.log(commentsData);
            setCommentsByPostId({
                ...commentsByPostId,
                [postId]: commentsData.content
            });

            const usersToFetch = commentsData.content.map(comment => comment.userId);
            const uniqueUserIds = [...new Set(usersToFetch)];

            const usersData = await Promise.all(uniqueUserIds.map(userId => UserService.getUser(userId)));
            const newCommentators = {};
            usersData.forEach(user => {
                newCommentators[user.id] = user;
            });

            setCommentators(prevUsers => ({
                ...prevUsers,
                ...newCommentators
            }));
        } catch (error) {
            console.error('Ошибка при получении комментариев:', error);
        }
    };

    const toggleComments = (postId) => {
        setOpenComments((prevOpenComments) => ({
            ...prevOpenComments,
            [postId]: !prevOpenComments[postId],
        }));

        if (!openComments[postId]) {
            fetchComments(postId);
        } else {
            setCommentsByPostId((prevComments) => ({
                ...prevComments,
                [postId]: undefined,
            }));
        }
    };

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

    function PostImageDropzone({ onFileSelected }) {
        const onDrop = useCallback(acceptedFiles => {
            onFileSelected(acceptedFiles[0]);
        }, [onFileSelected]);

        const { getRootProps, getInputProps } = useDropzone({ onDrop });

        return (
            <div {...getRootProps()} className={styles.dropzone}>
                <input {...getInputProps()} />
                <div className={styles.imageUpload}>
                    <label htmlFor="file-input">
                        <img src="https://cdn.icon-icons.com/icons2/1875/PNG/64/imagegallery_120168.png" />
                    </label>
                    <input id="file-input" type="file" />
                </div>
            </div>
        );
    }

    function UserProfileDropzone({ userProfileId }) {
        const [isFileSelected, setIsFileSelected] = useState(false);

        const onDrop = useCallback(acceptedFiles => {
            setSelectedProfileFile(acceptedFiles[0]);
            setIsFileSelected(true);
        }, []);

        const { getRootProps, getInputProps } = useDropzone({ onDrop });

        const handleUpload = () => {
            if (selectedProfileFile) {
                const formData = new FormData();
                formData.append('file', selectedProfileFile);

                axios.post(`http://localhost:8222/api/v1/users/${userProfileId}/image/upload`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Authorization": `Bearer ${localStorage.getItem('jwtToken')}`
                        }
                    }
                ).then(() => {
                    console.log("Файл загружен успешно");
                    window.location.reload();
                }).catch(err => {
                    console.log("Ошибка при загрузке изображения профиля:", err);
                });
            }
        };

        return (
            <div>
                {!isFileSelected && (
                    <div {...getRootProps()} className={styles.dropzone}>
                        <input {...getInputProps()} />
                        <button id="chIm">Change Image</button>
                    </div>
                )}
                {selectedProfileFile && (
                    <>
                        <p>Выбран файл: {selectedProfileFile.name}</p>
                        <button onClick={handleUpload}>Upload</button>
                    </>
                )}
            </div>
        );
    }

    const handleCreatePost = async (event) => {
        event.preventDefault();

        try {
            const newPost = await PostService.createPost({
                title: postTitle,
                content: postContent,
                userId: id,
            });

            window.location.reload();

            if (selectedPostFile) {
                const formData = new FormData();
                formData.append('file', selectedPostFile);

                await axios.post(`http://localhost:8222/api/v1/posts/${newPost}/image/upload`, formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

            }
        } catch (error) {
            console.error('Error creating the post:', error.response);
            if (error.response && error.response.status === 401) {
                alert("Authentication error. Please log in again.");
            }
        }
    };



    return (
        <div>
            {user ? (
                <div className={styles.userProfile}>
                    <div className={styles.user}>
                        {user.profileImageLink ? (
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
                        <div>
                            <h2>Мои посты</h2>
                            <form onSubmit={handleCreatePost}>
                                <div className={styles.headerForm}>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={postTitle}
                                        onChange={e => setPostTitle(e.target.value)}
                                    />
                                </div>
                                <div className={styles.contentForm}>
                                <textarea
                                    placeholder="Content"
                                    rows={3}
                                    value={postContent}
                                    onChange={e => setPostContent(e.target.value)}
                                />
                                    <PostImageDropzone onFileSelected={setSelectedPostFile} />
                                    {selectedPostFile && <p>Выбран файл: {selectedPostFile.name}</p>}
                                    <button type="submit">Create post</button>
                                </div>
                            </form>
                        </div>
                        {posts.map((post, index) => (
                            <div key={post.id} className={styles.post}>
                                {post.postImage && (
                                    <img
                                        className={styles.postImage}
                                        src={`http://localhost:8020/api/v1/posts/${post.id}/image/download`}
                                        alt="Post image"
                                    />
                                )}
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                                <h5>Создано: {formatDate(post.createdAt)}</h5>
                                <div className={styles.statContent}>
                                    <h5>{post.totalLikes}</h5>
                                    <form onSubmit={async e => {
                                        e.preventDefault();
                                        try {
                                            const response = await PostService.findLikesByUserIdAndPostId(userId, post.id);
                                            let updatedPosts = [...posts];

                                            if (response != null) {
                                                // Unlike the post
                                                console.log(response);
                                                await PostService.updatePostLikeStatus(post.id, userId);
                                                updatedPosts[index].totalLikes = post.totalLikes - 1;
                                                updatedPosts[index].isLiked = false;
                                            } else {
                                                // Like the post
                                                console.log(response);
                                                await PostService.updatePostLikeStatus(post.id, userId);
                                                updatedPosts[index].totalLikes = post.totalLikes + 1;
                                                updatedPosts[index].isLiked = true;
                                            }

                                            setPosts(updatedPosts);
                                        } catch (error) {
                                            console.error('Error updating like status:', error);
                                        }
                                    }}>
                                        <button type="submit" className={styles.likeButton}>
                                            <FontAwesomeIcon
                                                icon={post.isLiked ? filledHeart : outlinedHeart}
                                                size="2x"
                                                color={post.isLiked ? "red" : "black"}
                                            />
                                        </button>
                                    </form>
                                    <h5>{post.totalComments}</h5>
                                    <button
                                        type="button"
                                        className={styles.commentButton}
                                        onClick={() => toggleComments(post.id)}
                                    >
                                        <FontAwesomeIcon icon={faComment} size="2x"/>
                                        {openComments[post.id] ? 'Hide Comments' : 'Show Comments'}
                                    </button>
                                </div>
                                <div className={styles.comments}>
                                    {commentsByPostId[post.id] ? (
                                        commentsByPostId[post.id].map((comment) => (
                                            <div key={comment.id} className={styles.comment}>
                                                <div className={styles.commentator}>
                                                    <img
                                                        className={styles.commentatorImage}
                                                        src={`http://localhost:8010/api/v1/users/${comment.userId}/image/download`}
                                                        alt="User avatar"
                                                    />
                                                    <h5>{commentators[comment.userId]?.username || 'Загрузка...'}</h5>
                                                </div>
                                                <h5>{comment.comment}</h5>
                                                <h5>{formatDate(comment.createdAt)}</h5>
                                            </div>
                                        ))
                                    ) : null}
                                </div>

                                <button onClick={() => {
                                    PostService.deleteLikesByPostId(post.id).then(() => {
                                        PostService.deletePostById(post.id)
                                            .then(() => {
                                                window.location.reload();
                                            })
                                            .catch(err => {
                                                console.error('Ошибка при удалении поста:', err);
                                            });
                                    })
                                }}>Delete post
                                </button>
                                <hr/>

                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p>Загрузка...</p>
            )}
        </div>
    );

};

export default MyProfile;
