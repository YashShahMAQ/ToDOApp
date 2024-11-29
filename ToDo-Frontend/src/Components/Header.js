import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();

    const handleLogOut = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return(
        <header className="header">
            <h1>TO DO APP</h1>
            <button className="logout-button" onClick={handleLogOut}>
                Log Out
            </button>
        </header>
    );
};

export default Header;