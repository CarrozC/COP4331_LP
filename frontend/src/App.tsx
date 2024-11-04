import React from 'react';
import './App.css';
import LandingPage from './components/LandingPage'; // Import the new LandingPage component
import Signup from './components/Signup'; //Imports signup
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; //imports routing
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
      {/* Render the LandingPage component */}
      <Route path = "/" element = {<LandingPage />}/>
      <Route path = "/signup" element = {<Signup />} />
      <Route path="/login" element={<Login />} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;

