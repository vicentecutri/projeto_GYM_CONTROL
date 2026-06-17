import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});
// Injeta o token guardado no localStorage automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ou o nome exato da chave que salvou no Login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
// Interceptor para injetar o Token JWT automaticamente em todas as chamadas
api.interceptors.request.use(
  (config) => {
    // Busca o token que foi salvo no localStorage no momento do login
    const token = localStorage.getItem('token');
    
    if (token) {
      // Injeta o token no formato Bearer exigido pela maioria dos Middlewares
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;