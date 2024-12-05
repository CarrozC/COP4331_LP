// src/components/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser} from "../contexts/UserContext"; 
import './Login.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useUser(); 

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        const payload = { Login: username, Password: password };

        try {
            const response = await fetch('http://group30.xyz/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log(data); 

            if (data.error) {
                setError(data.error);
            } else {
                const userData = {
                    id: data.id, 
                    firstName: data.first_name, 
                    lastName: data.last_name,   
                    username: data.username, 
                    allergens: data.allergens || [], 
                    favorites: data.favorites || [], 
                    pantry: data.pantry || [], 
                    email: data.email || '',
                    diet: data.diet || [],
                    emailVerified: data.verifiedEmail || false
                }; 
                setUser(userData); 
                navigate('/recipes'); // Redirect to Recipes
            }

        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to log in. Please try again.');
        }
    };

    return (
        <div className="login">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </label>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <button type="submit">Login</button>
                </form>
                {error && <p className="error">{error}</p>}
                <p className="signup-link">
                    <Link to="/Signup">Don't have an account? Sign up here</Link>
                </p>
                <p className="forgot-password-link">
                    <Link to="/forgot-password">Forgot Password?</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
