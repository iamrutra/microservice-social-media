import React, {useEffect, useState} from 'react';
import UserService from "../API/UserService";
import styles from '../styles/AllUsers.module.css';

const AllUsers = () => {

    const [users, setUsers] = useState([]);


    useEffect(() => {
        UserService.getAllUsers().then(data => setUsers(data));
    }, []);

    return (
        <main className={styles.mainAllUsers}>
            <h1>All Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}><a href={"user/" + user.id}>{user.username}</a></li>
                ))}
            </ul>
        </main>
    );
};

export default AllUsers;