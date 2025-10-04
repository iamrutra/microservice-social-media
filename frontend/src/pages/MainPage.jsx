import React from 'react';
import styles from '../styles/MainPage.module.css';

const MainPage = () => {
    return (
        <main className={styles.mainMainPage}>
            <div className="container">
                <h1 className="headline">
                    Welcome to <span className="gradient-text">Social Media</span> <br/>
                    <span>Made by Artur Chub - <i>iamrutra</i></span>
                </h1>
            </div>
        </main>
    );
};

export default MainPage;