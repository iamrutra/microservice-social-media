import UserProfile from "../pages/UserProfile";
import MainPage from "../pages/MainPage";
import AllUsers from "../pages/AllUsers";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";


export const privateRoutes = [

]

export const publicRoutes = [
    { path: '/', component: <MainPage />},
    { path: '/user/:id', component: <UserProfile />},
    { path: '/users', component: <AllUsers /> },
    { path: '/auth/login', component: <LoginPage /> },
    { path: '/auth/register', component: <RegisterPage /> },
]