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
import UserProfileDropzone from "../components/UserProfileDropzone";
import PostImageDropzone from "../components/PostImageDropzone";

const MyProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [selectedPostFile, setSelectedPostFile] = useState(null);
    const [postTitle, setPostTitle] = useState('');
    const [postContent, setPostContent] = useState('');
    const userId = localStorage.getItem('userId');
    const [commentsByPostId, setCommentsByPostId] = useState({});
    const [commentators, setCommentators] = useState({});
    const [openComments, setOpenComments] = useState({});
    const [commentatorImages, setCommentatorImages] = useState({});
    const [pagePosts, setPagePosts] = useState(0);
    const [pageComments, setPageComments] = useState(0);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [isFirstComments, setIsFirstComments] = useState(true)
    const [isLastComments, setIsLastComments] = useState(false)
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [showEditProfile, setShowEditProfile] = useState(false);

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
                const postsData = await PostService.getPostsByUserId(id, pagePosts, 10);
                if (postsData.content.length === 0) {
                    setHasMorePosts(false);
                }

                setPosts(prevPosts => {
                    const newPosts = postsData.content.filter(post =>
                        !prevPosts.some(prevPost => prevPost.id === post.id)
                    );
                    return [...prevPosts, ...newPosts];
                });
            } catch (error) {
                console.error('Ошибка при получении данных постов пользователя:', error);
            }
        };
        const fetchFollowersAndFollowing = async () => {
            try {
                const followersData = await UserService.getFollowers(id);
                const followingData = await UserService.getFollowing(id);
                setFollowers(followersData);
                setFollowing(followingData);
                console.log(followersData);
                console.log(followingData);
            } catch (error) {
                console.error('Error getting followers and following:', error);
            }
        }

        fetchFollowersAndFollowing();
        fetchUser();
        fetchPosts();
    }, [pagePosts, id]);

    const fetchComments = async (postId) => { // NOT MINE PEACE OF CODE!!! I JUST ADDED THIS FUNCTION, its works and god thanks for that
        try {
            const commentsData = await PostService.getAllCommentsByPostId(postId, 5, pageComments);
            if(commentsData.content.length === 0){
                handlePreviousCommentsPage();
            }
            if (commentsData.first === true){
                setIsFirstComments(true)
            } else {
                setIsFirstComments(false)
            }
            console.log("isFirst " + isFirstComments)
            if (commentsData.last === true){
                setIsLastComments(true)
            } else {
                setIsLastComments(false)
            }
            console.log("isLast " + isLastComments)
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
            console.error('Failed fetch comments:', error);
        }
    };
    useEffect(() => {
        const postIdsWithOpenComments = Object.keys(openComments).filter(postId => openComments[postId]);

        postIdsWithOpenComments.forEach(postId => {
            fetchComments(postId);
        });
    }, [pageComments, openComments]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 10 && hasMorePosts) {
            setPagePosts(prevPages => prevPages + 1); // Увеличиваем номер страницы при достижении конца страницы
        }
    }, [hasMorePosts]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);


    const fetchCommentatorImage = async (userId) => {
        try {
            const user = await UserService.getUser(userId);
            if (user.profileImageLink) {
                return `http://localhost:8010/api/v1/users/${userId}/image/download`;
            }
            return `http://localhost:8010/api/v1/users/defaultPfp/image/download`;
        } catch (error) {
            console.error('Ошибка при загрузке изображения комментатора:', error);
            return `http://localhost:8010/api/v1/users/defaultPfp/image/download`;
        }
    };

    useEffect(() => {
        const loadCommentatorImages = async () => {
            const newCommentatorImages = {};
            for (const userId of Object.keys(commentators)) {
                const imageUrl = await fetchCommentatorImage(userId);
                newCommentatorImages[userId] = imageUrl;
            }
            setCommentatorImages(newCommentatorImages);
        };

        if (Object.keys(commentators).length > 0) {
            loadCommentatorImages();
        }
    }, [commentators]);

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

    function handlePreviousCommentsPage() {
        setPageComments(prevPage => prevPage - 1);
        console.log(pageComments);
    }

    function handleNextCommentsPage() {
        setPageComments(prevPage => prevPage + 1);
        console.log(pageComments);
    }
    const toggleEditProfile = () => {
        setShowEditProfile(prevState => !prevState); // Toggle the edit profile form visibility
    };


    function editProfile(event) {
        event.preventDefault();

        const username = document.getElementById("editUsername").value;
        const fullName = document.getElementById("editFullName").value;
        const dateOfBirth = document.getElementById("editDateOfBirth").value;
        const email = document.getElementById("editEmail").value;
        const password = document.getElementById("editPassword").value;

        const userData = {
            username: (username !== "") ? username : null,
            fullName: (fullName !== "") ? fullName : null,
            dateOfBirth: (dateOfBirth !== "") ? dateOfBirth : null,
            email: (email !== "") ? email : null,
            password: (password !== "") ? password : null,
        };

        UserService.updateUser(userId, userData)
            .then(response => {
                console.log("User updated successfully:", response);
                window.location.reload();
            })
            .catch(error => {
                console.log("Error updating profile:", error);
            });
    }


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
                        <button onClick={toggleEditProfile}>Edit profile</button>
                        <h3 className={styles.followers}>{followers.length} followers</h3>
                        <h3 className={styles.following}>{following.length} following</h3>
                        <h2>Username: {user.username}</h2>
                        <h3>Full Name: {user.fullName}</h3>
                        <h3>Date of Birth: {user.dateOfBirth}</h3>
                        <h3>Created at: {formatDate(user.createdAt)}</h3>
                    </div>

                    <div className={styles.posts}>
                    <div>
                        <h2>My Posts</h2>
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
                                    <h5 className="totalCommets">{post.totalComments}</h5>
                                    <button
                                        type="button"
                                        className={styles.commentButton}
                                        onClick={() => toggleComments(post.id)}
                                    >
                                        <FontAwesomeIcon icon={faComment} size="2x" color="black"/>
                                    </button>
                                </div>
                                <div className={styles.comments}>
                                    {
                                        openComments[post.id] ?
                                            <form onSubmit={async (e) => {
                                                e.preventDefault();
                                                const comment = e.target[0].value;
                                                const totalComments = document.getElementsByClassName('totalCommets');
                                                totalComments[index].innerText = parseInt(totalComments[index].innerText) + 1;
                                                console.log(comment);
                                                e.target[0].value = '';
                                                try {
                                                    await PostService.createComment(
                                                        comment,
                                                        post.id,
                                                        userId
                                                    );
                                                    fetchComments(post.id);
                                                } catch (error) {
                                                    console.error('Error creating comment:', error);
                                                }
                                            }}>
                                                <input type="text" placeholder="Enter your comment"></input>
                                                <button type="submit">Send</button>
                                            </form>
                                            : null
                                    }
                                    {commentsByPostId[post.id] ? (
                                        commentsByPostId[post.id].map((comment) => (
                                            <div key={comment.id} className={styles.comment}>
                                                <div className={styles.commentator}>
                                                    <img
                                                        className={styles.commentatorImage}
                                                        src={commentatorImages[comment.userId] || 'loading_image_placeholder_url'}
                                                        alt="User avatar"
                                                    />
                                                    <h4>{commentators[comment.userId]?.username || 'Загрузка...'}</h4>
                                                    <h5>{comment.comment}</h5>
                                                </div>

                                                <h5>Created at: {formatDate(comment.createdAt)}</h5>
                                                <button onClick={async () => {
                                                    const totalComments = document.getElementsByClassName('totalCommets');
                                                    totalComments[index].innerText = parseInt(totalComments[index].innerText) - 1;
                                                    console.log(post.id);
                                                    await PostService.deleteCommentByIdAndPostId(comment.id, post.id);
                                                    fetchComments(post.id);
                                                }}>Delete comment</button>
                                                <hr></hr>
                                            </div>
                                        ))
                                    ) : null}
                                    {
                                        openComments[post.id] ?
                                            <div className={styles.pagination}>
                                                <button onClick={handlePreviousCommentsPage}
                                                        disabled={isFirstComments}
                                                        className={styles.arrowButton}>
                                                    &larr;
                                                </button>
                                                <button onClick={handleNextCommentsPage}
                                                        disabled={isLastComments}
                                                        className={styles.arrowButton}>
                                                    &rarr;
                                                </button>
                                            </div>
                                            : null
                                    }
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
                        {!hasMorePosts && <p>No more posts to load</p>}
                    </div>
                    {showEditProfile && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modalWindow}>
                                <button className={styles.closeButton} onClick={toggleEditProfile}>&times;</button>
                                <div className={styles.editProfile}>
                                    <h2>Edit Profile</h2>
                                    <form>
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
                                        <UserProfileDropzone userProfileId={id}/>
                                        <div>
                                            <label>Username</label>
                                            <input id="editUsername" type="text" placeholder={user.username}/>
                                        </div>
                                        <div>
                                            <label>Full Name</label>
                                            <input id="editFullName" type="text" placeholder={user.fullName}/>
                                        </div>
                                        <div>
                                            <label>Date of Birth</label>
                                            <input id="editDateOfBirth" type="date" placeholder={user.dateOfBirth}/>
                                        </div>
                                        <div>
                                            <label>Email</label>
                                            <input id="editEmail" type="email" placeholder={user.email}/>
                                        </div>
                                        <div>
                                            <label>Password</label>
                                            <input id="editPassword" type="password" placeholder="Password"/>
                                        </div>
                                        <button onClick={editProfile}>Save</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>Загрузка...</p>
            )}
        </div>
    );

};

export default MyProfile;
