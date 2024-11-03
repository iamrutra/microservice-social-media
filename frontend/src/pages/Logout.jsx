import React from 'react';
import UserService from "../API/UserService";
import {parse} from "@fortawesome/fontawesome-svg-core";

const handleLogout = () => {
    UserService.getUser(parseInt(localStorage.getItem("userId"))).then((response) => {
        const user = response.data;
        user.status = "OFFLINE";
        UserService.updateUser(parseInt(localStorage.getItem("userId")), user).then((response) => {
            console.log(response.data);
        });
    });
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userId");
}
const Logout = () => {
    return (
        <div>
            {handleLogout()}
            {window.location.href = 'http://localhost:3000'}
        </div>
    );
};

export default Logout;