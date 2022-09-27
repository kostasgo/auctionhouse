import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/v1/auctions';

class AuctionService {
    createNewAuction(username, name, description, categories, firstBid, buyPrice, ends, country, location, latitude, longitude, images, imageNames) {
        return axios.post(API_URL+"/new_auction", {
            username,
            name,
            description,
            categories,
            firstBid,
            buyPrice,
            ends,
            country,
            location,
            latitude,
            longitude,
            images,
            imageNames
            },{ headers: authHeader() });
        }

    getAllAuctions() {
        return axios.get(API_URL);
    }

    getAllActiveAuctions() {
        return axios.get(API_URL+"?active=true");
    }

    getActiveNonUserAuctions(id = -1) {
        return axios.get(API_URL+"?active=true&id="+id);
    }

    searchActiveNonUserAuctions(searchInput = "",active = true , id = -1){
        return axios.get(API_URL+"?search="+searchInput+"&active="+active+"&id="+id);
    }
}

export default new AuctionService();
