import React, { useState } from 'react';
import styles from '../styles/LoginPage.module.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:8222/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const token = await response.text();
            localStorage.setItem('jwtToken', token);
            console.log(localStorage.getItem('jwtToken'));
            alert('Login successful!');
        } else {
            const errorMessage = await response.text();
            alert(`Error: ${errorMessage}`);
        }
    };


    return (
        <div className={styles.loginPage}>

            <form onSubmit={handleLogin}>
                <h1>Login Page</h1>
                <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;