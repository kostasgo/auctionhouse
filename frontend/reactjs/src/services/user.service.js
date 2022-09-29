import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/v1/users/';

class UserService {

    getUserBoard(id) {
        return axios.get(API_URL + id, { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(API_URL, { headers: authHeader() });
    }

    getNotify(id) {
        return axios.get(API_URL+id, { headers: authHeader() });
    }

    enable(username) {
        return axios.post(API_URL + "enable", {
            username
        }, { headers: authHeader() });
    }

    disableNotify(id) {
        return axios.post(API_URL + "disableNotify", {id}, { headers: authHeader() });
    }
}

export default new UserService();
