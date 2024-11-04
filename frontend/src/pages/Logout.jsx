import React from 'react';
import UserService from "../API/UserService";
import {parse} from "@fortawesome/fontawesome-svg-core";

const handleLogout = () => {
    UserService.getUser(parseInt(localStorage.getItem("userId"))).then((response) => {
        const user = response;
        user.status = "OFFLINE";
        console.log(user);
        UserService.updateUser(user.id, user).then((response) => {
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
            {window.location.href = "/"}
        </div>
    );
};

export default Logout;