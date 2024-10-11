import axios from "axios";

// Create an Axios instance with an interceptor
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
            params: { page, size } // Send pagination parameters
        });
        return response.data;
    }

    static async getUserByUsername(username) {
        const response = await apiClient.get(`users/username/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    }
    //
}
