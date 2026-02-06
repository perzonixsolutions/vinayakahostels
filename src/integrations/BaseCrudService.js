const API_BASE_URL = 'http://localhost:3000/api';

class BaseCrudService {
    static async getAll(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error in getAll(${endpoint}):`, error);
            throw error;
        }
    }

    static async getById(endpoint, id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error in getById(${endpoint}, ${id}):`, error);
            throw error;
        }
    }

    static async create(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error in create(${endpoint}):`, error);
            throw error;
        }
    }

    static async update(endpoint, id, data) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
                method: 'PUT', // or PATCH depending on your API
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error in update(${endpoint}, ${id}):`, error);
            throw error;
        }
    }

    static async delete(endpoint, id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error in delete(${endpoint}, ${id}):`, error);
            throw error;
        }
    }
}

export default BaseCrudService;
