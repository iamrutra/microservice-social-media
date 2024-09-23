import React from 'react';
import axios from "axios";

export default class UserService {
    static async getUsers(id) {
        const response = await axios.get(`http://localhost:8010/api/v1/users/${id}`);
        return response.data;
    }
};

