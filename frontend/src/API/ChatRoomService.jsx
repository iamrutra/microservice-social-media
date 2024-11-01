import axios from "axios";

export default class ChatRoomService {
    static async findAllConnectedUsers() {
        const response = await axios.get('http://localhost:8040/users');
        return response.data;
    }
}