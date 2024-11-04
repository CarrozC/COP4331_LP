// src/components/Signup.tsx
import React, { useState } from 'react';
import './Signup.css'; // Optional: add custom styling for the signup page

const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [firstName, setFirstName] = useState(''); 
    const [lastName, setLastName] = useState(''); 

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you can add logic to handle signup, like form validation or API calls
        if (password !== repeatPassword) {
            alert("Passwords do not match!");
            return;
        }
        alert(`Signup successful for ${email}`);
    };

    return (
        <div className="signup">
            <div className="signup-container">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignup}>
                    <label>
                        First Name: 
                        <input
                            type="text"
                            value= {firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required>
                        </input>
                    </label>
                    <label>
                        Last Name: 
                        <input
                            type="text"
                            value= {lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required>
                        </input>
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
            </div>
        </div>
       
    );
};

export default Signup;

