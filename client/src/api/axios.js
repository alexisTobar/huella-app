import axios from 'axios';

const instance = axios.create({
    // VITE_API_URL será la dirección que nos dé Render más adelante
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api' 
});

export default instance;