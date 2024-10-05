import React from 'react';

const handleLogout = () => {
    localStorage.removeItem("jwtToken");
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