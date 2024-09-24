import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import UserService from "../API/UserService";

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await UserService.getUser(id);
                setUser(userData);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
            }
        };

        fetchUser();
    }, [id]);

    return (
        <div>
            <h1>User Profile</h1>
            {user ? (
                <div>
                    <h2>Username: {user.username}</h2>
                    <h3>Full Name: {user.fullName}</h3>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserProfile;