import UserProfile from "./pages/UserProfile";
import {BrowserRouter, Link, Route, Router, Routes} from "react-router-dom";
import AppRouter from "./components/AppRouter";

function App() {
    return (


        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    )
}

export default App;
