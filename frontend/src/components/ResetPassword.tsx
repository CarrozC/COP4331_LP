import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
