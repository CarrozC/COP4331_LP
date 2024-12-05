// src/components/Signup.tsx
import React, { useState } from 'react';
import './Signup.css'; // Optional: add custom styling for the signup page
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    async function doSignup(event: React.FormEvent): Promise<void> {
        event.preventDefault();

        // Check if passwords match
        if (password !== repeatPassword) {
            setMessage('Passwords do not match. Please try again.');
            return;
        }

        const obj = {
            Login: username,
            Password: password,
            FirstName: firstName,
            LastName: lastName,
            Email: email
        };
        const js = JSON.stringify(obj);

        try {
            const response = await fetch('http://group30.xyz/api/signup', {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();

            if (res.id <= 0) {
                setMessage('Signup failed. Please try again.');
            } else {
                localStorage.removeItem('user_data');
                setMessage('Signup successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
            }
        } catch (error: any) {
            console.error(error);
            setMessage('An error occurred. Please try again.');
        }
    }

    return (
        <div className="signup">
            <div className="signup-container">
                <h2>Sign Up</h2>
                <form onSubmit={doSignup}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>
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
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                    <label>
                        Repeat Password:
                        <input
                            type="password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Sign Up</button>
                </form>
                {message && <p className="signup-message">{message}</p>}
            </div>
        </div>
    );
};

export default Signup;
