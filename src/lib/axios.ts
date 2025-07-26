import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://expensetrace.onrender.com/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;