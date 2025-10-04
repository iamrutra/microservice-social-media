import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import FeedsService from "../API/FeedsService";
import PostService from "../API/PostService";
import UserService from "../API/UserService";
import { useParams } from "react-router-dom";
import styles from "../styles/FeedsPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faHeart as filledHeart, 
    faSmile,
    faImage,
    faPaperPlane
} from "@fortawesome/free-solid-svg-icons";
import { 
    faComment, 
    faHeart as outlinedHeart
} from "@fortawesome/free-regular-svg-icons";

const FeedsPage = () => {
    const [posts, setPosts] = useState([]);
    const userId = localStorage.getItem("userId");
    const [commentsByPostId, setCommentsByPostId] = useState({});
    const [commentators, setCommentators] = useState({});
    const [openComments, setOpenComments] = useState({});
    const [commentatorImages, setCommentatorImages] = useState({});
    const [pagePosts, setPagePosts] = useState(0);
    const [pageComments, setPageComments] = useState(0);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [isFirstComments, setIsFirstComments] = useState(true);
    const [isLastComments, setIsLastComments] = useState(false);
    const [users, setUsers] = useState({});
    const [authorImages, setAuthorImages] = useState({});
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState({});

    const checkUserLikes = async (posts) => {
        const postsWithLikes = await Promise.all(
            posts.map(async (post) => {
                try {
                    const likeResponse = await PostService.findLikesByUserIdAndPostId(userId, post.id);
                    return {
                        ...post,
                        isLiked: likeResponse != null
                    };
                } catch (error) {
                    console.error('Error checking like status:', error);
                    return {
                        ...post,
                        isLiked: false
                    };
                }
            })
        );
        return postsWithLikes;
    };

    useEffect(() => {
        const fetchFeeds = async () => {
            setLoading(true);
            try {
                const postsData = await FeedsService.getAllPosts(pagePosts, 10);
                if (postsData.body.content.length === 0) {
                    setHasMorePosts(false);
                }

                // Check user likes for new posts
                const postsWithLikes = await checkUserLikes(postsData.body.content);

                setPosts(prevPosts => {
                    const newPosts = postsWithLikes.filter(post =>
                        !prevPosts.some(prevPost => prevPost.id === post.id)
                    );
                    return [...prevPosts, ...newPosts];
                });
            } catch (error) {
                console.error('Ошибка при получении данных постов:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeeds();
    }, [pagePosts, userId]);

    const fetchComments = async (postId) => {
        try {
            const commentsData = await PostService.getAllCommentsByPostId(postId, 5, pageComments);
            setIsFirstComments(commentsData.first);
            setIsLastComments(commentsData.last);
            
            setCommentsByPostId(prev => ({
                ...prev,
                [postId]: commentsData.content
            }));

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
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 10 && hasMorePosts && !loading) {
            setPagePosts(prevPages => prevPages + 1);
        }
    }, [hasMorePosts, loading]);

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
        setOpenComments(prev => ({
            ...prev,
            [postId]: !prev[postId],
        }));

        if (!openComments[postId]) {
            fetchComments(postId);
        } else {
            setCommentsByPostId(prev => ({
                ...prev,
                [postId]: undefined,
            }));
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - d);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        
        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        const hours = d.getHours();
        const minutes = d.getMinutes();

        return `${day < 10 ? "0" + day : day}.${month < 10 ? "0" + month : month}.${year} ${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    };

    const handleLike = async (post, index) => {
        try {
            const response = await PostService.findLikesByUserIdAndPostId(userId, post.id);
            let updatedPosts = [...posts];

            if (response != null) {
                await PostService.updatePostLikeStatus(post.id, userId);
                updatedPosts[index].totalLikes = post.totalLikes - 1;
                updatedPosts[index].isLiked = false;
            } else {
                await PostService.updatePostLikeStatus(post.id, userId);
                updatedPosts[index].totalLikes = post.totalLikes + 1;
                updatedPosts[index].isLiked = true;
            }

            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error updating like status:', error);
        }
    };

    const handleCommentSubmit = async (e, postId, index) => {
        e.preventDefault();
        const comment = newComment[postId] || '';
        if (!comment.trim()) return;

        try {
            await PostService.createComment(comment, postId, userId);
            
            // Update comment count
            const updatedPosts = [...posts];
            updatedPosts[index].totalComments += 1;
            setPosts(updatedPosts);
            
            // Clear input
            setNewComment(prev => ({ ...prev, [postId]: '' }));
            
            // Refresh comments
            fetchComments(postId);
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleDeleteComment = async (commentId, postId, index) => {
        try {
            await PostService.deleteCommentByIdAndUserIdAndPostId(commentId, parseInt(userId), postId);
            
            // Update comment count
            const updatedPosts = [...posts];
            updatedPosts[index].totalComments -= 1;
            setPosts(updatedPosts);
            
            // Refresh comments
            fetchComments(postId);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handlePreviousCommentsPage = () => {
        setPageComments(prevPage => Math.max(0, prevPage - 1));
    };

    const handleNextCommentsPage = () => {
        setPageComments(prevPage => prevPage + 1);
    };

    const fetchUser = useCallback(async (id) => {
        try {
            if (!users[id]) {
                const fetchedUser = await UserService.getUser(id);
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
            console.error('Ошибка при загрузке изображения автора:', error);
            return `http://localhost:8010/api/v1/users/defaultPfp/image/download`;
        }
    };

    return (
        <main className={styles.feedsMain}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        <span className={styles.gradientText}>News Feed</span>
                    </h1>
                    <p className={styles.subtitle}>Stay updated with the latest posts</p>
                </div>

                <div className={styles.posts}>
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <article key={post.id} className={styles.post}>
                                {/* Post Header */}
                                <div className={styles.postHeader}>
                                    <div className={styles.authorInfo}>
                                        <img
                                            className={styles.authorImage}
                                            src={authorImages[post.userId] || 'loading_image_placeholder_url'}
                                            alt="User avatar"
                                        />
                                        <div className={styles.authorDetails}>
                                            <a href={"user/" + users[post.userId]?.id} className={styles.authorName}>
                                                {users[post.userId]?.username || 'Loading...'}
                                            </a>
                                            <span className={styles.postTime}>
                                                {formatDate(post.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className={styles.postContent}>
                                    {post.title && <h3 className={styles.postTitle}>{post.title}</h3>}
                                    {post.content && <p className={styles.postText}>{post.content}</p>}
                                    {post.postImage && (
                                        <div className={styles.postImageContainer}>
                                            <img
                                                className={styles.postImage}
                                                src={`http://localhost:8020/api/v1/posts/${post.id}/image/download`}
                                                alt="Post image"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Post Actions */}
                                <div className={styles.postActions}>
                                    <div className={styles.actionGroup}>
                                        <button 
                                            className={styles.actionButton}
                                            onClick={() => handleLike(post, index)}
                                        >
                                            <FontAwesomeIcon
                                                icon={post.isLiked ? filledHeart : outlinedHeart}
                                                className={post.isLiked ? styles.liked : ''}
                                            />
                                            <span>{post.totalLikes}</span>
                                        </button>
                                        
                                        <button 
                                            className={styles.actionButton}
                                            onClick={() => toggleComments(post.id)}
                                        >
                                            <FontAwesomeIcon icon={faComment} />
                                            <span>{post.totalComments}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                {openComments[post.id] && (
                                    <div className={styles.commentsSection}>
                                        {/* Comment Form */}
                                        <form 
                                            className={styles.commentForm}
                                            onSubmit={(e) => handleCommentSubmit(e, post.id, index)}
                                        >
                                            <img
                                                className={styles.commentUserImage}
                                                src={authorImages[userId] || 'loading_image_placeholder_url'}
                                                alt="Your avatar"
                                            />
                                            <div className={styles.commentInputContainer}>
                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                value={newComment[post.id] || ''}
                                                onChange={(e) => setNewComment(prev => ({ 
                                                    ...prev, 
                                                    [post.id]: e.target.value 
                                                }))}
                                                className={styles.commentInput}
                                            />
                                                <button 
                                                    type="submit" 
                                                    className={styles.commentSubmit}
                                                    disabled={!newComment[post.id]?.trim()}
                                                >
                                                    <FontAwesomeIcon icon={faPaperPlane} />
                                                </button>
                                            </div>
                                        </form>

                                        {/* Comments List */}
                                        {commentsByPostId[post.id] && (
                                            <div className={styles.commentsList}>
                                                {commentsByPostId[post.id].map((comment) => (
                                                    <div key={comment.id} className={styles.comment}>
                                                        <img
                                                            className={styles.commentatorImage}
                                                            src={commentatorImages[comment.userId] || 'loading_image_placeholder_url'}
                                                            alt="User avatar"
                                                        />
                                                        <div className={styles.commentContent}>
                                                            <div className={styles.commentHeader}>
                                                            <span className={styles.commentatorName}>
                                                                {commentators[comment.userId]?.username || 'Loading...'}
                                                            </span>
                                                                <span className={styles.commentTime}>
                                                                    {formatDate(comment.createdAt)}
                                                                </span>
                                                            </div>
                                                            <p className={styles.commentText}>{comment.comment}</p>
                                                        </div>
                                                        {comment.userId === parseInt(userId) && (
                                                            <button 
                                                                className={styles.deleteCommentButton}
                                                                onClick={() => handleDeleteComment(comment.id, post.id, index)}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                
                                                {/* Pagination */}
                                                <div className={styles.commentsPagination}>
                                                    <button 
                                                        onClick={handlePreviousCommentsPage}
                                                        disabled={isFirstComments}
                                                        className={styles.paginationButton}
                                                    >
                                                        ← Previous
                                                    </button>
                                                    <button 
                                                        onClick={handleNextCommentsPage}
                                                        disabled={isLastComments}
                                                        className={styles.paginationButton}
                                                    >
                                                        Next →
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </article>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <FontAwesomeIcon icon={faImage} />
                            </div>
                            <h3>No posts yet</h3>
                            <p>Be the first to share something interesting!</p>
                        </div>
                    )}
                    
                    {loading && (
                        <div className={styles.loadingState}>
                            <div className={styles.spinner}></div>
                            <p>Loading new posts...</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default FeedsPage;