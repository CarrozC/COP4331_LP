import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext'; //UserContext
import { useNavigate } from 'react-router-dom'; // For redirection
import './VerifyEmail.css';

const VerifyEmail: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useUser(); // Get the logged-in user's data
  const navigate = useNavigate();

  const handleVerifyCode = async () => {
    try {
      if (!user?.username) {
        throw new Error('No username found. Please log in.');
      }

      const response = await fetch('/api/validateEmailVerification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, Code: code }), // Use the username from context
      });

      if (!response.ok) {
        throw new Error('Invalid or expired verification code.');
      }

      setMessage('Email verified successfully!');
      setError('');
      // Redirect to the login page after a delay
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to verify email. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="verify-email">
      <div className="verify-email-container">
        <h2>Verify Your Email</h2>
        <p>Please enter the verification code sent to your email.</p>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
        />
        <button onClick={handleVerifyCode}>Verify Email</button>
        {error && <p className="message error">{error}</p>}
        {message && <p className="message success">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
