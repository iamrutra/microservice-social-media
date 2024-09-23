import UserProfile from "../pages/UserProfile";


export const privateRoutes = [

]

export const publicRoutes = [
    { path: '/user/:id', component: <UserProfile />},
]