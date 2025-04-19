import React from 'react';
import GithubAuth from '../components/GithubAuth';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <header className="header">
        <h1>Aiwallah PR Review Bot</h1>
        <p className="subtitle">Automated code reviews powered by AI</p>
      </header>
      
      <section className="auth-section">
        <div className="auth-card">
          <h2>Get Started</h2>
          <p>Sign in with GitHub to connect your repositories and start receiving AI-powered code reviews.</p>
          <GithubAuth />
        </div>
      </section>
      
      <section className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Automated PR Reviews</h3>
            <p>Get instant feedback on your pull requests</p>
          </div>
          <div className="feature-card">
            <h3>Code Quality Analysis</h3>
            <p>Identify bugs and code quality issues</p>
          </div>
          <div className="feature-card">
            <h3>Best Practices</h3>
            <p>Learn industry best practices through AI suggestions</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 