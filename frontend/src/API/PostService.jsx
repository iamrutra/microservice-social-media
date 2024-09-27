import React from 'react';
import axios from "axios";

export default class PostService {
    static async getPostByUserId(id) {
        const response = await axios.get(`http://localhost:8020/api/v1/posts/user/${id}`);
        return response.data
    }
};