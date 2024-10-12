import axios from "axios";

const token = localStorage.getItem('jwtToken');

export default class PostService {
    static async getPostsByUserId(id, page = 0, size = 10) {
        const response = await axios.get(`http://localhost:8222/api/v1/posts/user/${id}?page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data
    }
    static async createPost(post) {
        const response = await axios.post(`http://localhost:8222/api/v1/posts/create`, post, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    static async deletePostById(id) {
        const response = await axios.delete(`http://localhost:8222/api/v1/posts/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    }
    static async updatePostLikeStatus(postId, userId) {
        const response = await axios.post(
            'http://localhost:8222/api/v1/likes/like',
            {
                postId: postId,
                userId: userId
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    }
    static async findLikesByUserIdAndPostId(userId, postId) {
        const response = await axios.post(
            `http://localhost:8222/api/v1/likes/findByUserIdAndPostId`,
            {  // Sending the data in the body
                userId: userId,
                postId: postId
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    }
    static async deleteLikesByPostId(postId) {
        const response = await axios.delete(
            `http://localhost:8222/api/v1/likes/deleteByPost/${postId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    }
    static async getAllCommentsByPostId(postId) {
        const response = await axios.get(
            `http://localhost:8222/api/v1/comments/getAll/${postId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    }
    static async createComment(comment, postId, userId) {
        const response = await axios.post(
            `http://localhost:8222/api/v1/comments/create`,
            {
                comment: comment,
                postId: postId,
                userId: userId
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    }

    // deleteCommentByIdAndPostId
    static async deleteCommentByIdAndPostId(commentId, postId) {
        try {
            const response = await axios.delete(
                `http://localhost:8222/api/v1/comments/deleteByIdAndPostId?commentId=${commentId}&postId=${postId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting comment:', error.response);
        }
    }

    // deleteCommentByIdAndUserIdAndPostId
    static async deleteCommentByIdAndUserIdAndPostId(commentId, userId, postId) {
        try {
            const response = await axios.delete(
                `http://localhost:8222/api/v1/comments/deleteByIdAndUserIdAndPostId?commentId=${commentId}&userId=${userId}&postId=${postId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error deleting comment:', error.response);
        }
    }
};