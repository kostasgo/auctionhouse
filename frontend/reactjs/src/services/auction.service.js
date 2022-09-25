import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/v1/auctions';

class AuctionService {
    getAllAuctions() {
        return axios.get(API_URL);
    }

    getActiveNonUserAuctions(id) {
        return axios.get(API_URL+"?active=true&id="+id);
    }
}

export default new AuctionService();
