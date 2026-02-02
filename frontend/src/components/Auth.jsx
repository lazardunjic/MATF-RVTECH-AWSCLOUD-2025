import React, { useState } from 'react';
import './Auth.css';
import { IoClose } from 'react-icons/io5';

const Auth = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');

  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>
          <IoClose size={24} />
        </button>

        <div className="auth-header">
          <h2>Welcome to EV Chargers</h2>
          <p>Find and navigate to charging stations</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        <div className="auth-content">
          {activeTab === 'login' ? (
            <div>LOGIN FORM - TODO</div>
          ) : (
            <div>REGISTER FORM - TODO</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;