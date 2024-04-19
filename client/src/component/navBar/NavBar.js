import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './navBar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleHome = () => {  
    navigate('/');
  }

  const handleRecord = () => {
    navigate('/record');
  }
  
  return (
    <nav className="navbar">
      <button className="navbar-brand" onClick={handleHome}>Home</button>
      <div className="nav-items">
        <button className="nav-item" onClick={handleRecord}>Record</button>
      </div>
    </nav>
  );
};
export default Navbar;