import axios from 'axios';

const port = process.env.PORT;

export const api = axios.create({
    baseURL: 'http://0.0.0.0:${port}/'
})
