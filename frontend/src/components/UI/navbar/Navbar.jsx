import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import styles from '../../../styles/Navbar.module.css';
import GatewayService from "../../../API/GatewayService";

const Navbar = () => {
    const [isTokenValid, setIsTokenValid] = useState(null);
    const userId = localStorage.getItem('userId'); // Получаем userId из localStorage


    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const validateToken = async () => {
                try {
                    const response = await GatewayService.isTokenValid(token);
                    setIsTokenValid(response);
                } catch (error) {
                    setIsTokenValid(false);
                }
            };
            validateToken();
        } else {
            setIsTokenValid(false);
        }
    }, [localStorage.getItem('jwtToken')]);


    return (
        <nav>
            <Link to={"/"}>Main</Link>
            {isTokenValid ? (
                <>
                    <Link to={"/feeds"}>Feeds</Link>
                    <Link to={"/users"}>Search</Link>
                    <Link to={`/myProfile/${userId}`}>Profile</Link>
                    <Link to={'/logout'}>Log out</Link>
                </>
            ) : (
                <>
                    <Link to={"/auth/login"}>Sign in</Link>
                    <Link to={"/auth/register"}>Sign up</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;
