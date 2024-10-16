import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";
import FeedsService from "../API/FeedsService";
import PostService from "../API/PostService";
import UserService from "../API/UserService";
import {useParams} from "react-router-dom";
import styles from "../styles/FeedsPage.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart as filledHeart} from "@fortawesome/free-solid-svg-icons";
import {faComment, faHeart as outlinedHeart} from "@fortawesome/free-regular-svg-icons";


const FeedsPage = () => {
    const [posts, setPosts] = useState([]);
    const userId = localStorage.getItem("userId");
    const [commentsByPostId, setCommentsByPostId] = useState({});
    const [commentators, setCommentators] = useState({});
    const [openComments, setOpenComments] = useState({});
    const [commentatorImages, setCommentatorImages] = useState({});
    const [pagePosts, setPagePosts] = useState(0);
    const [pageComments, setPageComments] = useState(0);
    const [hasMorePosts, setHasMorePosts] = useState(true)
    const [isFirstComments, setIsFirstComments] = useState(true)
    const [isLastComments, setIsLastComments] = useState(false)
    const [users, setUsers] = useState({});
    const [authorImages, setAuthorImages] = useState({})


    useEffect(() => {
        console.log("Page posts changed:", pagePosts);
        const fetchFeeds = async () => {
            try {
                const postsData = await FeedsService.getAllPosts(pagePosts, 10);
                console.log("Fetched posts:", postsData.body.content);
                if (postsData.body.content.length === 0) {
                    setHasMorePosts(false);
                }

                setPosts(prevPosts => {
                    const newPosts = postsData.body.content.filter(post =>
                        !prevPosts.some(prevPost => prevPost.id === post.id)
                    );
                    return [...prevPosts, ...newPosts];
                });
            } catch (error) {
                console.error('Ошибка при получении данных постов пользователя:', error);
            }
        };
        fetchFeeds();
    }, [pagePosts]);

    const fetchComments = async (postId) => { // NOT MINE PEACE OF CODE!!! I JUST ADDED THIS FUNCTION, its works and god thanks for that
        try {
            const commentsData = await PostService.getAllCommentsByPostId(postId, 5, pageComments);
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
            console.error('Ошибка при получении комментариев:', error);
        }
    };
    useEffect(() => {
        const postIdsWithOpenComments = Object.keys(openComments).filter(postId => openComments[postId]);

        postIdsWithOpenComments.forEach(postId => {
            fetchComments(postId);
        });
    }, [pageComments, openComments]);

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

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 10 && hasMorePosts) {
            setPagePosts(prevPages => {
                console.log(prevPages + 1);
                return prevPages + 1;
            });
        }
    }, [hasMorePosts]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

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

    useEffect(() => {
        const loadAuthorImages = async () => {
            const newAuthorImages = {};
            for (const userId of Object.keys(users)) {
                const imageUrl = await fetchAuthorImage(userId);
                newAuthorImages[userId] = imageUrl;
            }
            setAuthorImages(newAuthorImages);
        };

        if (Object.keys(users).length > 0) {
            loadAuthorImages();
        }
    }, [users]);

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

    function handlePreviousCommentsPage() {
        setPageComments(prevPage => prevPage - 1);
        console.log(pageComments);
    }

    function handleNextCommentsPage() {
        setPageComments(prevPage => prevPage + 1);
        console.log(pageComments);
    }

    const fetchUser = useCallback(async (id) => {
        try {
            if (!users[id]) {
                const fetchedUser = await UserService.getUser(id);
                console.log(fetchedUser)
                setUsers(prevUsers => ({
                    ...prevUsers,
                    [id]: fetchedUser
                }));
            }
        } catch (error) {
            console.error('Ошибка при загрузке пользователя:', error);
        }
    }, [users]);

    useEffect(() => {
        const loadUsers = async () => {
            const userIds = posts.map(post => post.userId);
            await Promise.all(userIds.map(id => fetchUser(id)));
        };
        if (posts.length > 0) {
            loadUsers();
        }
    }, [posts, fetchUser]);

    const fetchAuthorImage = async (userId) => {
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

    return (
        <main className={styles.feedsMain}>

            <div className={styles.posts}>
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <div key={post.id} className={styles.post}>
                            <div className={styles.author}>
                                <img
                                    className={styles.authorImage}
                                    src={authorImages[post.userId] || 'loading_image_placeholder_url'}
                                    alt="User avatar"
                                />
                                <a href={"user/" + users[post.userId]?.id}>{users[post.userId]?.username || 'Loading user...'}</a>
                            </div>
                            {post.postImage && (
                                <img
                                    className={styles.postImage}
                                    src={`http://localhost:8020/api/v1/posts/${post.id}/image/download`}
                                    alt="Post image"
                                />
                            )}
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <h5>Created at: {formatDate(post.createdAt)}</h5>
                            <div className={styles.statContent}>
                                <h5>{post.totalLikes}</h5>
                                <form onSubmit={async (e) => {
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
                                    <FontAwesomeIcon icon={faComment} size="2x"/>
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
                                            {comment.userId === parseInt(userId) ? (
                                                <button onClick={async () => {
                                                    const totalComments = document.getElementsByClassName('totalCommets');
                                                    totalComments[index].innerText = parseInt(totalComments[index].innerText) - 1;
                                                    await PostService.deleteCommentByIdAndUserIdAndPostId(comment.id, parseInt(userId), post.id);
                                                    fetchComments(post.id);
                                                }}>Delete comment
                                                </button>
                                            ) : console.log(userId, comment.userId)}
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
                            <hr/>
                        </div>
                    ))
                ) : (
                    <h3>No posts yet</h3>
                )}
            </div>
        </main>
    );
};

export default FeedsPage;