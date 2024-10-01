import axios from "axios";

export default class PostService {
    static async getPostsByUserId(id) {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8222/api/v1/posts/user/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data
    }
};