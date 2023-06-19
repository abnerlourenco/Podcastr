import axios from 'axios';
import 'dotenv/config';

const port = process.env.PORT;

export const api = axios.create({
    baseURL: 'http://0.0.0.0:${port}/'
})
