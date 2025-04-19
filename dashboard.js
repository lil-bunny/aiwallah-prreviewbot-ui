// Dashboard functionality for Aiwallah PR Review Bot

// Constants
const API_BASE_URL = 'https://heroic-teal-excited.ngrok-free.app';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  const connectGitHubBtn = document.getElementById('connect-github-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const usernameElement = document.getElementById('username');
  const welcomeNameElement = document.getElementById('welcome-name');
  const repositoriesList = document.getElementById('repositories-list');
  
  // Check if user is logged in
  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('username');
  
  if (!userId) {
    // Redirect to login page if not logged in
    window.location.href = 'index.html';
    return;
  }
  
  // Update UI with user info
  if (username) {
    usernameElement.textContent = username;
    welcomeNameElement.textContent = username;
  }
  
  // Add event listeners
  if (connectGitHubBtn) {
    connectGitHubBtn.addEventListener('click', () => {
      connectGitHubApp(userId);
    });
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
  
  // Load user data and repositories
  loadUserData(userId);
});

/**
 * Load user data and repositories
 * @param {string} userId - The user ID
 */
async function loadUserData(userId) {
  try {
    const userData = await getUserProfile(userId);
    updateRepositoriesList(userData);
  } catch (error) {
    console.error('Error loading user data:', error);
    
    // Show error in repositories list
    const repositoriesList = document.getElementById('repositories-list');
    if (repositoriesList) {
      repositoriesList.innerHTML = `
        <div class="error-message">
          <p>Failed to load repositories. ${error.message}</p>
          <button onclick="loadUserData('${userId}')" class="retry-btn">Retry</button>
        </div>
      `;
    }
  }
}

/**
 * Update repositories list in the UI
 * @param {Object} userData - User data from API
 */
function updateRepositoriesList(userData) {
  const repositoriesList = document.getElementById('repositories-list');
  if (!repositoriesList) return;
  
  // Clear loading state
  repositoriesList.innerHTML = '';
  
  // Check if user has repositories
  if (!userData.repositories || userData.repositories.length === 0) {
    repositoriesList.innerHTML = `
      <div class="empty-state">
        <p>No repositories found. Connect your GitHub app to see your repositories here.</p>
      </div>
    `;
    return;
  }
  
  // Display repositories
  userData.repositories.forEach(repo => {
    const repoCard = document.createElement('div');
    repoCard.className = 'repository-card';
    
    repoCard.innerHTML = `
      <h3>${repo.name}</h3>
      <p class="repo-description">${repo.description || 'No description'}</p>
      <div class="repo-meta">
        <span>${repo.language || 'Unknown'}</span>
        <span>Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
    `;
    
    repositoriesList.appendChild(repoCard);
  });
}

/**
 * Logout the user
 */
function logout() {
  // Clear user data from localStorage
  localStorage.removeItem('user_id');
  localStorage.removeItem('github_user_id');
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  
  // Redirect to home page
  window.location.href = 'index.html';
} 