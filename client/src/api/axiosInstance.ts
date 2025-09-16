import axios from "axios";

const axiosInstance = axios.create({
    baseURL : "http://localhost:4000/api/v1/user/",
    timeout : 5000,
    headers : {
        'Content-Type' : "application/json",
        "Accept" : 'application/json'
    },
});

export default axiosInstance;