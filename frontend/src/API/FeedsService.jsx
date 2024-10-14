import axios from "axios";


const token = localStorage.getItem('jwtToken');

export default class FeedsService {
    static async getAllPosts(page = 0, size = 10) {
        const response = await axios.get(`http://localhost:8222/api/v1/feed?page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data
    }
}