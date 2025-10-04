import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import styles from '../../../styles/Navbar.module.css';
import GatewayService from "../../../API/GatewayService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faMessage, faUser, faRightFromBracket, faRightToBracket, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const [isTokenValid, setIsTokenValid] = useState(null);
    const userId = localStorage.getItem('userId');


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
        <nav className={styles.navbar}>
            <div className={styles.navInner + ' container'}>
                <Link to={'/'} className={styles.brand}>
                    <span className={styles.brandDot}/>
                    Social Media
                </Link>
                <div className={styles.links}>
                    {isTokenValid ? (
                        <>
                            <Link className={styles.link} to={"/feeds"} aria-label="Feeds">
                                <FontAwesomeIcon icon={faHouse} />
                                <span style={{ marginLeft: 8 }}>Feeds</span>
                            </Link>
                            <Link className={styles.link} to={"/users"} aria-label="Search">
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                                <span style={{ marginLeft: 8 }}>Search</span>
                            </Link>
                            <Link className={styles.link} to={"/direct"} aria-label="Direct">
                                <FontAwesomeIcon icon={faMessage} />
                                <span style={{ marginLeft: 8 }}>Direct</span>
                            </Link>
                            <Link className={styles.link} to={`/myProfile/${userId}`} aria-label="Profile">
                                <FontAwesomeIcon icon={faUser} />
                                <span style={{ marginLeft: 8 }}>Profile</span>
                            </Link>
                            <Link className={styles.cta} to={'/logout'} aria-label="Log out">
                                <FontAwesomeIcon icon={faRightFromBracket} />
                                <span style={{ marginLeft: 8 }}>Log out</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link className={styles.link} to={"/auth/login"} aria-label="Sign in">
                                <FontAwesomeIcon icon={faRightToBracket} />
                                <span style={{ marginLeft: 8 }}>Sign in</span>
                            </Link>
                            <Link className={styles.cta} to={"/auth/register"} aria-label="Sign up">
                                <FontAwesomeIcon icon={faUserPlus} />
                                <span style={{ marginLeft: 8 }}>Sign up</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
