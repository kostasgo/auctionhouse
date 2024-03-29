import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/auth/";

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + "signin", {
                username,
                password
            })
            .then(response => {
                if (response.data.token) {
                    this.removeGuest();
                    localStorage.setItem("user", JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
        localStorage.removeItem("guest");
        // this.setGuest();
    }

    register(username, name, email, roles, password, phone, country, location) {
        return axios.post(API_URL + "signup", {
            username,
            name,
            email,
            roles,
            password,
            phone,
            country,
            location
        });
    }

    setGuest() {
        localStorage.setItem("guest", "guest");
    }

    getGuest() {
        return localStorage.getItem("guest");
    }

    removeGuest() {
        localStorage.removeItem("guest");
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));;
    }
}

export default new AuthService();
