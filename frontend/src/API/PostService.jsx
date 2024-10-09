import axios from "axios";

const token = localStorage.getItem('jwtToken');

export default class PostService {
    static async getPostsByUserId(id) {
        const response = await axios.get(`http://localhost:8222/api/v1/posts/user/${id}`, {
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
};