import React from 'react';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to the App!</h1>
      <p>Your go-to app for recipe inspiration based on ingredients you have.</p>
      <div className="auth-buttons">
        <button onClick={() => alert('Navigate to Login')}>Login</button>
        <button onClick={() => alert('Navigate to Sign Up')}>Sign Up</button>
      </div>
    </div>
  );
};

export default LandingPage;
