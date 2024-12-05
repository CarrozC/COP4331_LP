// src/components/Navbar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('user_data');
        navigate('/login');
    };

    return (
        <div className="navbar">
            {/* Hamburger Menu Icon */}
            <div className="hamburger-menu" onClick={toggleMenu}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
            </div>

            {/* Sliding Menu */}
            <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
                <ul>
                    <li onClick={() => {navigate('/profile'); toggleMenu(); }}>
                        <span className="icon">👤</span> Profile
                    </li>
                    <li onClick={() => {navigate('/recipes'); toggleMenu();}}>
                        <span className="icon">🔍</span> Search
                    </li>
                    <li onClick={() => {navigate('/pantry'); toggleMenu();}}>
                        <span className="icon">🛒</span> Pantry
                    </li>
                    <li onClick={handleLogout}>
                        <span className="icon">🚪</span> Logout
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
