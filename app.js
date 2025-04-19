// Constants
const API_BASE_URL = 'https://heroic-teal-excited.ngrok-free.app';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  const githubSignInBtn = document.getElementById('github-signin-btn');
  
  // Add event listeners
  if (githubSignInBtn) {
    githubSignInBtn.addEventListener('click', signInWithGitHub);
  }
  
  // Check if we're on the callback page
  if (window.location.pathname.includes('callback')) {
    handleOAuthCallback();
  }
});

/**
 * Sign in with GitHub - redirects to GitHub OAuth flow
 */
function signInWithGitHub() {
  window.location.href = `${API_BASE_URL}/oauth/login`;
}

/**
 * Process the OAuth callback from GitHub
 */
async function handleOAuthCallback() {
  // Create callback UI
  const callbackContainer = document.createElement('div');
  callbackContainer.className = 'callback-container';
  
  const loadingSpinner = document.createElement('div');
  loadingSpinner.className = 'loading-spinner';
  
  const title = document.createElement('h2');
  title.textContent = 'Authenticating with GitHub...';
  
  const message = document.createElement('p');
  message.textContent = 'Please wait while we complete the sign-in process.';
  
  callbackContainer.appendChild(loadingSpinner);
  callbackContainer.appendChild(title);
  callbackContainer.appendChild(message);
  
  // Replace body content with callback UI
  document.body.innerHTML = '';
  document.body.appendChild(callbackContainer);
  
  try {
    // Get the code and state from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
    if (!code || !state) {
      throw new Error('Missing required OAuth parameters');
    }
    
    // Call the API to process the OAuth callback
    const response = await processOAuthCallback(code, state);
    
    // Save user data to localStorage
    localStorage.setItem('user_id', response.user_id);
    localStorage.setItem('github_user_id', response.github_user_id);
    localStorage.setItem('username', response.username);
    localStorage.setItem('email', response.email);
    
    // Show success UI
    showSuccessUI();
    
    // Redirect to dashboard after successful auth
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  } catch (error) {
    console.error('Authentication error:', error);
    showErrorUI(error.message || 'Failed to authenticate with GitHub');
  }
}

/**
 * Show success UI after successful authentication
 */
function showSuccessUI() {
  const callbackContainer = document.querySelector('.callback-container');
  callbackContainer.innerHTML = '';
  callbackContainer.className = 'callback-container success';
  
  const successIcon = document.createElement('div');
  successIcon.className = 'success-icon';
  successIcon.textContent = '✓';
  
  const title = document.createElement('h2');
  title.textContent = 'Successfully Authenticated!';
  
  const message = document.createElement('p');
  message.textContent = 'Redirecting to your dashboard...';
  
  callbackContainer.appendChild(successIcon);
  callbackContainer.appendChild(title);
  callbackContainer.appendChild(message);
}

/**
 * Show error UI after failed authentication
 */
function showErrorUI(errorMessage) {
  const callbackContainer = document.querySelector('.callback-container');
  callbackContainer.innerHTML = '';
  callbackContainer.className = 'callback-container error';
  
  const title = document.createElement('h2');
  title.textContent = 'Authentication Error';
  
  const message = document.createElement('p');
  message.textContent = errorMessage;
  
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.textContent = 'Back to Home';
  backButton.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
  
  callbackContainer.appendChild(title);
  callbackContainer.appendChild(message);
  callbackContainer.appendChild(backButton);
}

/**
 * API Functions
 */

/**
 * Process GitHub OAuth callback
 * @param {string} code - OAuth code from GitHub
 * @param {string} state - OAuth state parameter
 * @returns {Promise<Object>} Auth response with user data
 */
async function processOAuthCallback(code, state) {
  try {
    const response = await fetch(`${API_BASE_URL}/oauth/callback?code=${code}&state=${state}`);
    if (!response.ok) {
      throw new Error('OAuth callback failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error processing OAuth callback:', error);
    throw error;
  }
}

/**
 * Get user profile data
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User profile data
 */
async function getUserProfile(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Connect GitHub App for the user
 * @param {string} userId - The user ID
 * @param {string} systemPrompt - System prompt for the bot
 * @returns {Promise<Object>} Configuration response with redirect URL
 */
async function connectGitHubApp(userId, systemPrompt = "Default PR review instructions") {
  try {
    const response = await fetch(`${API_BASE_URL}/configure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        system_prompt: systemPrompt,
        integration: 'github'
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to configure GitHub app');
    }
    
    const data = await response.json();
    window.location.href = data.redirect_url;
    return data;
  } catch (error) {
    console.error('Error connecting GitHub app:', error);
    throw error;
  }
} 