

import React, { useState, useEffect, forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import '../../styles/Login.css';

const Login = forwardRef(({ url, onClose }, ref) => {
    const { user, loading, error, handleLogin, clearError } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin(username, password, url);
       onClose && onClose();  // Close the modal after successful login
    };

    useEffect(() => {
        clearError();
    }, [user, navigate]);

    return (
        <div className="login-modal">
             <div className="login-overlay" onClick={onClose}></div>
            <div className="login-container" ref={ref}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="error-message">{error === 'Request failed with status code 401' ? null : error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <div className="extra-links">
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <span>Or</span>
                    <Link to="/register">Create New Account</Link>
                </div>
            </div>
        </div>
    );
});

export default Login;
