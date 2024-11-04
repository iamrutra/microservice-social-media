import React from 'react';
import {publicRoutes, privateRoutes} from "../router/Router";
import {Route, Routes} from "react-router-dom";

const AppRouter = () => {
    return (
        <Routes>
            {publicRoutes.map(route =>
                <Route
                    key={route.path}
                    path={route.path}
                    element={route.component}
                />
            )}
            {privateRoutes.map(route =>
                <Route
                    key={route.path}
                    path={route.path}
                    element={route.component}
                />
            )}
        </Routes>
    );
};

export default AppRouter;