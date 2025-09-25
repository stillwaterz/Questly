import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

class AuthService {
  constructor() {
    this.currentUser = null;
  }

  // Google OAuth login
  initiateGoogleLogin() {
    const redirectUrl = `${window.location.origin}/`;
    const authUrl = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
    window.location.href = authUrl;
  }

  // Process session ID from URL fragment
  async processSessionId(sessionId) {
    try {
      const response = await axios.post(`${API}/auth/session`, {
        session_id: sessionId
      });
      
      this.currentUser = response.data.user;
      
      // Clean URL fragment
      window.history.replaceState({}, document.title, window.location.pathname);
      
      return response.data.user;
    } catch (error) {
      console.error('Session processing failed:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await axios.get(`${API}/auth/user`);
      this.currentUser = response.data;
      return response.data;
    } catch (error) {
      console.error('Get user failed:', error);
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      await axios.post(`${API}/auth/logout`);
      this.currentUser = null;
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      return false;
    }
  }

  // Check for session ID in URL fragment
  checkUrlForSessionId() {
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);
    return params.get('session_id');
  }
}

export default new AuthService();