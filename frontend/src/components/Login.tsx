// src/components/Login.tsx
import React, { useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you can add logic to handle login, like form validation or API calls
        alert(`Logged in as ${email}`);
    };

    return (
        <div className="login">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
