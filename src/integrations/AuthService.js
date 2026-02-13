import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api') + '/auth';

// Helper to get token
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: `Bearer ${token}` };
    }
    return {};
};

const AuthService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            // Validate token with backend
            const response = await axios.get(`${API_URL}/me`, {
                headers: getAuthHeader()
            });
            return response.data.user;
        } catch (error) {
            // Token is invalid or expired
            AuthService.logout();
            return null;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export default AuthService;
