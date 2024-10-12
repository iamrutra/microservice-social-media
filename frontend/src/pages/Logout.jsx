import React from 'react';

const handleLogout = () => {
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