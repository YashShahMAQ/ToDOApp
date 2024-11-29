import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/LoginPage.css";


function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Please enter both username and password");
            return;
        }

        try {

            const response = await axios.post("http://localhost:5000/api/login", {
                username,
                password
            });

            if (response.data.error) {
                setError(response.data.error);
                return;
            }

            localStorage.setItem("token", response.data.token);
            navigate("/lists");

        } catch (err) {
            setError(
                err.response?.data?.message || "An error occurred. Please try again."
            )
        }
    }

    return (
        <div className="login-container">
            <h1>Login Page</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default LoginPage;