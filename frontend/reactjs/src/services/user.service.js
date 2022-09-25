import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/v1/users/';

class UserService {
    getPublicContent() {
        return axios.get(API_URL + 'all');
    }

    getUserBoard() {
        return axios.get(API_URL + 'user', { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    enable(username) {
        return axios.post(API_URL + "enable", {
            username
        }, { headers: authHeader() });
    }
}

export default new UserService();
