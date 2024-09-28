import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080/',
    realm: 'iamrutra',
    clientId: 'springboot-keycloak'
});

keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
    if (authenticated) {
        console.log("User is authenticated");
    } else {
        console.log("User is not authenticated");
        keycloak.login();
    }
});

export default keycloak;
