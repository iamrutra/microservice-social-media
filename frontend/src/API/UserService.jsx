import axios from "axios";

export default class UserService {
    static async getUser(id) {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8222/api/v1/users/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    }
    static async getAllUsers() {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get('http://localhost:8222/api/v1/users/getAll', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
        return response.data;
    }
};

