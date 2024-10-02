import React, { useEffect, useState } from 'react';
import UserService from "../API/UserService";
import styles from '../styles/AllUsers.module.css';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10); // State for number of users per page

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await UserService.getAllUsers(currentPage, pageSize); // Fetch users with current page and page size
                setUsers(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, [currentPage, pageSize]); // Re-fetch users when currentPage or pageSize changes

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value)); // Update page size
        setCurrentPage(0); // Reset to first page whenever page size changes
    };

    return (
        <main className={styles.mainAllUsers}>
            <h1>All Users</h1>
            <label htmlFor="pageSize">Users per page:</label>
            <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} className={styles.pageSizeSelect}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
            </select>
            <ul className={styles.userList}>
                {users.map(user => (
                    <li key={user.id}><a href={"user/" + user.id}>{user.username}</a></li>
                ))}
            </ul>
            <div className={styles.pagination}>
                <button onClick={handlePreviousPage} disabled={currentPage === 0} className={styles.arrowButton}>
                    &larr; {/* Left arrow */}
                </button>
                <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1} className={styles.arrowButton}>
                    &rarr; {/* Right arrow */}
                </button>
            </div>
        </main>
    );
};

export default AllUsers;
