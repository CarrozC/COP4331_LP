import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
import Signup from './components/Signup';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Recipes from './components/Recipes';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import { UserProvider } from './contexts/UserContext';
import Pantry from './components/Pantry'; 
import { ResetPasswordEmailProvider } from './contexts/ResetPasswordEmailContext';
import VerifyEmail from './components/VerifyEmail';


function App() {
  return (
    <UserProvider>
      <ResetPasswordEmailProvider>
        <div className="App">
          <ConditionalNavbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pantry" element={<Pantry />}/>
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Routes>
        </div>
      </ResetPasswordEmailProvider>
    </UserProvider>
  );
}


function ConditionalNavbar() {
  const location = useLocation(); 
  const noNavbarRoutes = ['/login', '/Signup', '/forgot-password', '/reset-password', '/'];
  
  // Only show Navbar if the current route is not in noNavbarRoutes
  return !noNavbarRoutes.includes(location.pathname) ? <Navbar /> : null;
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
