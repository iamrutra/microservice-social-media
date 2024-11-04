import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:8222/api/v1/',
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            window.location.href = 'http://localhost:3000/auth/login';
        }
        return Promise.reject(error);
    }
);

const token = localStorage.getItem('jwtToken');

export default class UserService {
    static async getUser(id) {
        const response = await apiClient.get(`users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    }

    static async getAllUsers(page = 0, size = 10) { // Accept page and size parameters
        const response = await apiClient.get('users/getAll', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: { size } // Send pagination parameters
        });
        return response.data;
    }

    static async getUserByUsername(username, token) {
        const response = await apiClient.get(`users/username/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    }

    static async searchUsers(username) {
        const response = await apiClient.get(`users/search?username=${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    }

    static async followUser(followerId, followingId) {
        const response = await apiClient.post(`users/follow/${followerId}/${followingId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    }

    static async isFollowing(followerId, followingId) {
        const response = await apiClient.get(`users/isFollowing/${followerId}/${followingId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    }

    static async unfollowUser(followerId, followingId) {
        const response = await apiClient.post(`users/unfollow/${followerId}/${followingId}`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    }

    static async getFollowers(userId) {
        const response = await apiClient.get(`users/followers/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    }

    static async getFollowing(userId) {
        const response = await apiClient.get(`users/following/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    }

    static async updateUser(id, user) {
        const response = await apiClient.put(`users/${id}`, user, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    }


}
