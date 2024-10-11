import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function CustomAlert({ message, onClose }) {
    if (!message) return null;
    
    return (
        <div className="login-alert-overlay">
            <div className="login-alert">
                <p>{message}</p>
                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
}

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'naufallabibb' && password === 'dot1234') {
            onLogin();
        } else {
            setAlertMessage('Incorrect username or password');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src="/dot-login.png" alt="DOT Logo" className="login-logo" />
                <h2 className="login-title">Login to account</h2>
                <p className="login-subtitle">Access the ultimate quiz experience and unlock powerful tools to challenge your knowledge!</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={togglePasswordVisibility}
                                aria-label="Toggle password visibility"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="login-button">Start Quiz</button>
                </form>
            </div>
            <CustomAlert 
                message={alertMessage} 
                onClose={() => setAlertMessage('')}
            />
        </div>
    );
}

export default Login;