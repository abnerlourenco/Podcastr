import axios from 'axios';

export const api = axios.create({
    baseURL: `${process.env.URL_SERVER_API}/`
})
