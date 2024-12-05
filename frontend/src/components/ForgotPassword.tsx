import React, { useState } from 'react';
import './ForgotPassword.css'
import { useNavigate } from 'react-router-dom'; 
import { useResetPasswordEmail } from '../contexts/ResetPasswordEmailContext';

const ForgotPassword: React.FC = () => {
  const {email, setEmail} = useResetPasswordEmail();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/requestPasswordReset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password reset link sent to your email.');
        setTimeout(() => {
          navigate(`/reset-password?email=${encodeURIComponent(email)}`); // Use navigate
        }, 3000);
      } else {
        setError(data.error || 'Failed to send password reset link.');
      }
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
