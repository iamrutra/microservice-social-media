import React from 'react';
import axios from "axios";

export default class UserService {
    static async getUser(id) {
        const response = await axios.get(`http://localhost:8010/api/v1/users/${id}`);
        return response.data;
    }
    static async getAllUsers() {
        const response = await axios.get('http://localhost:8010/api/v1/users/getAll');
        console.log(response.data);
        return response.data;
    }
};

