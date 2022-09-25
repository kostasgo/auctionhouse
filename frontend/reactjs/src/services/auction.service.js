import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/v1/auctions/';

class UserService {
    getAllAuctions() {
        return axios.get(API_URL);
    }
}

export default new UserService();
