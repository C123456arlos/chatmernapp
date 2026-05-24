// import axios from 'axios'

// const axiosInstance = axios.create({
//     baseUrl: import.meta.mode === 'development' ? 'http://localhost:5000/api' : '/api',
//     withCredentials: true
// })
// export default axiosInstance


import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

export default axiosInstance;