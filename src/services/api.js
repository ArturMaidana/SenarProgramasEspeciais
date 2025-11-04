import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://192.168.201.97/api/v1/auth'
  //baseURL: 'https://hsgee.senarmt.org.br/api/v1/auth',
  baseURL: 'https://sgee-atende.senarmt.org.br/api/v1/auth',
});

export default api;
