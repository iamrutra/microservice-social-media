export default class GatewayService {
    static async isTokenValid(token) {
        try {
            const myPromise = new Promise((resolve) => {
                resolve(true);
            });


            myPromise.then((result) => {
                console.log(result);
            });

            const response = await fetch('http://localhost:8222/auth/validateToken', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Token validation failed:', error);
            throw error;
        }
    }
}
