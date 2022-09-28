import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/v1/auctions';

class AuctionService {
    createNewAuction(username, name, description, categories, firstBid, buyPrice, ends, country, location, latitude, longitude, images, imageNames) {
        return axios.post(API_URL + "/new_auction", {
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
        }, { headers: authHeader() });
    }

    enableAuction(auction_id) {
        return axios.post(API_URL + "/enable", {
            auction_id
        }, { headers: authHeader() });
    }

    deleteAuction(auction_id) {
        return axios.delete(API_URL + "/delete/" + auction_id, { headers: authHeader() });
    }

    getAllAuctions() {
        return axios.get(API_URL);
    }

    getAllActiveAuctions() {
        return axios.get(API_URL + "?active=true");
    }

    getAllActiveAuctionsCount() {
        return axios.get(API_URL + "?active=true&count=true");
    }

    searchAuctions(searchInput = "", active = true, id = -1, offset = 0) {
        return axios.get(API_URL + "?search=" + searchInput + "&active=" + active + "&id=" + id + "&offset=" + offset);
    }

    searchAuctionsCount(searchInput = "", active = true, id = -1, count = true) {
        return axios.get(API_URL + "?search=" + searchInput + "&active=" + active + "&id=" + id + "&count=" + count);
    }

    getAllUserAuctions(id = -1, offset = 0) {
        return axios.get(API_URL + "?id=" + id + "&offset=" + offset);
    }

    getAllUserAuctionsCount(id = -1, count = true) {
        return axios.get(API_URL + "?id=" + id + "&count=" + count);
    }
}

export default new AuctionService();
