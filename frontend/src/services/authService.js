import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

class AuthService {
  constructor() {
    this.currentUser = null;
  }

  // Register new user
  async register(email, password, name) {
    try {
      const response = await axios.post(`${API}/auth/register`, {
        email,
        password, 
        name
      });
      
      this.currentUser = response.data.user;
      return response.data.user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await axios.post(`${API}/auth/login`, {
        email,
        password
      });
      
      this.currentUser = response.data.user;
      return response.data.user;
    } catch (error) {
      console.error('Login failed:', error);
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
}

export default new AuthService();