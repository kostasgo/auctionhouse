import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/v1/bids/';

class BidsService {

    newBid(auction_id, username, amount) {
        return axios.post(API_URL + "add_bid", {
            auction_id,
            username,
            amount
        }, { headers: authHeader() });
    }
}

export default new BidsService();
