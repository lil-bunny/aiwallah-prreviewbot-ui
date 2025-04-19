import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { processOAuthCallback } from '../services/api';
import '../styles/CallbackPage.css';

const CallbackPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Get the code and state from URL query parameters
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code || !state) {
          throw new Error('Missing required OAuth parameters');
        }

        // Process the OAuth callback
        const response = await processOAuthCallback(code, state);
        
        // Save user data to localStorage or state management
        localStorage.setItem('user_id', response.user_id);
        localStorage.setItem('github_user_id', response.github_user_id);
        localStorage.setItem('username', response.username);
        localStorage.setItem('email', response.email);
        
        // Redirect to dashboard after successful auth
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Authentication error:', error);
        setError(error.message || 'Failed to authenticate with GitHub');
      } finally {
        setLoading(false);
      }
    };

    processAuth();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="callback-container">
        <div className="loading-spinner"></div>
        <h2>Authenticating with GitHub...</h2>
        <p>Please wait while we complete the sign-in process.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="callback-container error">
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="callback-container success">
      <div className="success-icon">✓</div>
      <h2>Successfully Authenticated!</h2>
      <p>Redirecting to your dashboard...</p>
    </div>
  );
};

export default CallbackPage; 