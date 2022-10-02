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

    updateAuction(id, name, description, categories, firstBid, buyPrice, ends, location) {
        return axios.post(API_URL+"/update_auction", {
            id,
            name,
            description,
            categories,
            firstBid,
            buyPrice,
            ends,
            location,
            },{ headers: authHeader() });
        }

    enableAuction(auction_id) {
        return axios.post(API_URL + "/enable", {
            auction_id
        }, { headers: authHeader() });
    }

    buyOutAuction(auction_id, username) {
        return axios.post(API_URL + "/buyout", {
            auction_id,
            username
        }, { headers: authHeader() });
    }

    deleteAuction(auction_id) {
        return axios.delete(API_URL + "/delete/" + auction_id, { headers: authHeader() });
    }

    getRecommended(user_id) {
        return axios.get(API_URL + "/recommended" + "?id="+ user_id );
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

    searchAuctions(searchInput , max ,category ,country ,active , id, offset){
        return axios.get(API_URL+"/search?search="+searchInput+"&max="+max+"&category="+category+"&country="+country+"&active="+active+"&id="+id+"&offset="+offset);
    }

    searchAuctionsCount(searchInput ,max ,category ,country, active, id, count){
        return axios.get(API_URL+"/searchCount?search="+searchInput+"&max="+max+"&category="+category+"&country="+country+"&active="+active+"&id="+id+"&count=true");
    }

    getAllUserAuctions(id, offset) {
        return axios.get(API_URL + "?id=" + id + "&offset=" + offset);
    }

    getAllUserAuctionsCount(id , count) {
        return axios.get(API_URL + "?id=" + id + "&count=true");
    }
}

export default new AuctionService();
