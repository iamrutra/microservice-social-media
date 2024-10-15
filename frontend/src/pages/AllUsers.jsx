import React, { useEffect, useState } from 'react';
import UserService from "../API/UserService";
import styles from '../styles/AllUsers.module.css';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [authorImages, setAuthorImages] = useState({})


    useEffect(() => {
        const fetchUsers = async (username) => {
            if (username) {
                try {
                    const data = await UserService.searchUsers(username);
                    console.log('Fetched Users:', data);
                    setUsers(data);
                } catch (error) {
                    console.error("Error fetching users:", error);
                }
            } else {
                setUsers([]);
            }
        };

        fetchUsers('');

        if (searchTerm) {
            fetchUsers(searchTerm);
        }
    }, [searchTerm]);

    useEffect(() => {
        const loadAuthorImages = async () => {
            const newAuthorImages = {};
            // Iterate over the users array directly
            for (const user of users) {
                const imageUrl = await fetchAuthorImage(user.id);
                newAuthorImages[user.id] = imageUrl;
            }
            setAuthorImages(newAuthorImages);
        };

        if (users.length > 0) {
            loadAuthorImages();
        }
    }, [users]);

    const fetchAuthorImage = async (userId) => {
        try {
            const user = await UserService.getUser(userId);
            if (user.profileImageLink) {
                return `http://localhost:8010/api/v1/users/${userId}/image/download`;
            }
            return `http://localhost:8010/api/v1/users/defaultPfp/image/download`;
        } catch (error) {
            console.error('Ошибка при загрузке изображения комментатора:', error);
            return `http://localhost:8010/api/v1/users/defaultPfp/image/download`;
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <main className={styles.mainAllUsers}>
            <h1>All Users</h1>

            <label htmlFor="search">Search Users:</label>
            <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="Search by username"
                className={styles.searchInput}
            />

            <ul className={styles.userList}>
                {users.length === 0 ? (
                    <li>No users found</li>
                ) : (
                    users.map(user => (
                        <li key={user.id}>
                            <img
                                className={styles.authorImage}
                                src={authorImages[user.id]}
                                alt="User avatar"
                            />
                            <a href={"user/" + user.id}>{user.username}</a> <span>{user.fullName}</span>
                        </li>
                    ))
                )}
            </ul>
        </main>
    );
};

export default AllUsers;
