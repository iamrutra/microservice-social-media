import UserProfile from "./pages/UserProfile";
import {BrowserRouter, Link, Route, Router, Routes} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import Navbar from "./components/UI/navbar/Navbar";


function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <AppRouter/>
        </BrowserRouter>
    )
}

export default App;
