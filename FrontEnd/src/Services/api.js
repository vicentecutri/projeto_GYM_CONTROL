import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Certifique-se de que seu BackEnd está usando essa porta
});

export default api;