// API service for handling all backend communications

const API_BASE_URL = 'https://heroic-teal-excited.ngrok-free.app';

/**
 * Get user profile data
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
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
};

/**
 * Connect GitHub App for the user
 * @param {string} userId - The user ID
 * @param {string} systemPrompt - System prompt for the bot
 * @returns {Promise<Object>} Configuration response with redirect URL
 */
export const connectGitHubApp = async (userId, systemPrompt = "Default PR review instructions") => {
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
    
    return await response.json();
  } catch (error) {
    console.error('Error connecting GitHub app:', error);
    throw error;
  }
};

/**
 * Process GitHub OAuth callback
 * @param {string} code - OAuth code from GitHub
 * @param {string} state - OAuth state parameter
 * @returns {Promise<Object>} Auth response with user data
 */
export const processOAuthCallback = async (code, state) => {
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
}; 