import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/v1/auctions';

class AuctionService {
    createNewAuction(username, title, description, categories, firstBid, buyPrice, endDate, country, city, latitude, longitude, imgnames, imgdata) {
        return axios.post(API_URL, {
            username,
            title,
            description,
            categories,
            firstBid,
            buyPrice,
            endDate,
            country,
            city,
            latitude,
            longitude,
            imgnames,
            imgdata
            }, { headers: authHeader() });
        }

    getAllAuctions() {
        return axios.get(API_URL);
    }

    getActiveNonUserAuctions(id = -1) {
        return axios.get(API_URL+"?active=true&id="+id);
    }
}

export default new AuctionService();
