import React from 'react';
import {Link} from "react-router-dom";
import styles from '../../../styles/Navabar.module.css';

const Navbar = () => {
    return (
        <nav>
            <Link to={"/"}>Main</Link>

            <Link to={"/users"}>Users</Link>
        </nav>
    );
};

export default Navbar;