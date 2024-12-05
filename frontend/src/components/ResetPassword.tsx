import React, { useState } from 'react';
import './ResetPassword.css';
import { useResetPasswordEmail } from '../contexts/ResetPasswordEmailContext';

const ResetPassword: React.FC = () => {
  const {email, setEmail} = useResetPasswordEmail();
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    console.log(email); 
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }


    try {

      console.log(email); 
      console.log(resetCode); 
      console.log(newPassword);
      const response = await fetch('/api/validatePasswordReset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Email: email,
          Code: resetCode,
          NewPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password reset successful!');
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="reset-password">
      <div className="reset-password-container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Reset Code:
            <input
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              placeholder="Enter the reset code"
              required
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </label>
          <label>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
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

export default ResetPassword;
