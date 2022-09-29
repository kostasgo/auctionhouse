import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/v1/messages';

class ChatService {
    createNewMessage(text, senderId, recieverId) {
        return axios.post(API_URL+"/new_message", {
            text,
            senderId,
            recieverId,
            },{ headers: authHeader() });
        }

    getAllMessages() {
        return axios.get(API_URL);
    }

    getUserInbox(id) {
        return axios.post(API_URL+"?id="+id+"&inbox=true",{ headers: authHeader() });
    }
    getUserSent(id){
        return axios.post(API_URL+"?id="+id+"&sent=true",{ headers: authHeader() });
    }

    deleteMessage(id){
        return axios.post(API_URL+"/delete"+"?id="+id,{ headers: authHeader() });
    }

}

export default new ChatService();
