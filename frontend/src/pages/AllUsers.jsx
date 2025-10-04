import React, { useEffect, useState } from 'react';
import UserService from "../API/UserService";
import styles from '../styles/AllUsers.module.css';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [authorImages, setAuthorImages] = useState({});
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);


    useEffect(() => {
        const fetchUsers = async (username) => {
            setLoading(true);
            try {
                if (username && username.trim() !== '') {
                    // Search for specific users
                    const data = await UserService.searchUsers(username);
                    setUsers(Array.isArray(data.content) ? data.content : []);
                    setHasSearched(true);
                } else {
                    // Load all users when search is empty
                    const data = await UserService.getAllUsers();
                    setUsers(Array.isArray(data.content) ? data.content : []);
                    setHasSearched(false);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers(searchTerm);
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

            <div className={styles.usersContainer}>
                {loading ? (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>👥</div>
                        <h3>{hasSearched ? 'No users found' : 'No users available'}</h3>
                        <p>{hasSearched ? 'Try a different search term' : 'There are no users in the system yet'}</p>
                    </div>
                ) : (
                    <ul className={styles.userList}>
                        {users.map(user => (
                            <li key={user.id} className={styles.userItem}>
                                <img
                                    className={styles.authorImage}
                                    src={authorImages[user.id] || 'loading_image_placeholder_url'}
                                    alt="User avatar"
                                />
                                <div className={styles.userInfo}>
                                    <a href={"user/" + user.id} className={styles.username}>
                                        {user.username}
                                    </a>
                                    <span className={styles.fullName}>{user.fullName}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
};

export default AllUsers;
