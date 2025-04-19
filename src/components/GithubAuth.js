import React from 'react';
import { useNavigate } from 'react-router-dom';

// API endpoint constants
const API_BASE_URL = 'https://heroic-teal-excited.ngrok-free.app';

const GithubAuth = () => {
  const navigate = useNavigate();

  const signInWithGitHub = () => {
    window.location.href = `${API_BASE_URL}/oauth/login`;
  };

  return (
    <button 
      onClick={signInWithGitHub}
      className="github-signin-btn"
    >
      Sign in with GitHub
    </button>
  );
};

export default GithubAuth; 