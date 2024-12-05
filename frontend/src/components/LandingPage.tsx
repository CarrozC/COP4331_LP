import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer'; 

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-page">
      <VideoPlayer/>
      <div className="landing-page-container">
        <h1 className="app-title">Onion</h1>
        <p className="app-tagline">Turn your ingredients into culinary masterpieces!</p>
        <div className="auth-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
