const fetchUserData = async () => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        console.error('No token found');
        return;
    }

    try {
        const response = await fetch('http://localhost:8222/api/v1/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log('User data:', data);
        } else {
            console.error('Failed to fetch user data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
