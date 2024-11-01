import React from 'react';
import './LandingPage.css';
import {useNavigate } from 'react-router-dom'; 

const LandingPage: React.FC = () => {
  const navigate = useNavigate(); 
  return (
    <div className="landing-page">
      <h1>Welcome to the App!</h1>
      <p>Your go-to app for recipe inspiration based on ingredients you have.</p>
      <div className="auth-buttons">
        <button onClick={() => navigate('/login')}>Login</button>
        <button onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  );
};

export default LandingPage;
