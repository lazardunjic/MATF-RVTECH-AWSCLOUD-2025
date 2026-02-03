import React, { useState } from 'react';
import './Auth.css';
import { IoClose, IoMail, IoLockClosed, IoPerson } from 'react-icons/io5';
import { API_BASE_URL } from '../config';

const Auth = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('idToken', data.tokens.idToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        localStorage.setItem('userEmail', loginData.email);

        onLoginSuccess({
          email: loginData.email,
          tokens: data.tokens
        });

        onClose();

      } else {
        setError(data.error || 'Login failed');
      }

    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);

    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          name: registerData.name
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Registration successful! You can now login.');
        setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
        
        setTimeout(() => {
          setActiveTab('login');
          setSuccessMessage('');
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError('');
    setSuccessMessage('');
  };

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
            onClick={() => handleTabSwitch('login')}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('register')}
          >
            Register
          </button>
        </div>

        <div className="auth-content">
          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="auth-message success">
              {successMessage}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-wrapper">
                  <IoMail className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <IoLockClosed className="input-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <div className="auth-switch">
                Don't have an account?{' '}
                <button 
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => handleTabSwitch('register')}
                >
                  Register here
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Name</label>
                <div className="input-wrapper">
                  <IoPerson className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-wrapper">
                  <IoMail className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <IoLockClosed className="input-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="At least 8 characters"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <IoLockClosed className="input-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Re-enter password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>

              <div className="auth-switch">
                Already have an account?{' '}
                <button 
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => handleTabSwitch('login')}
                >
                  Login here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;