import UserProfile from "../pages/UserProfile";
import MainPage from "../pages/MainPage";
import AllUsers from "../pages/AllUsers";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MyProfile from "../pages/MyProfile";
import Logout from "../pages/Logout";


export const privateRoutes = [
    { path: '/users', component: <AllUsers /> },
    { path: '/myProfile/:id', component: <MyProfile /> },
    { path: '/logout', component: <Logout /> },
]

export const publicRoutes = [
    { path: '/', component: <MainPage />},
    { path: '/user/:id', component: <UserProfile />},
    { path: '/auth/login', component: <LoginPage /> },
    { path: '/auth/register', component: <RegisterPage /> },
]