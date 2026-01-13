import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4000/api' // La URL de tu servidor
});

export default instance;