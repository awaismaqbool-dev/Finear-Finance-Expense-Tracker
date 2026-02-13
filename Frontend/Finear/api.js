import axios from "axios";

const API = axios.create({
  baseURL: 'finear-finance-expense-tracker-production.up.railway.app', // Tumhara backend URL http://localhost:8080
  withCredentials: true, 
});
API.interceptors.request.use((config)=>{
const token = localStorage.getItem("token");
if(token){
    config.headers.Authorization=`Bearer ${token}`;
}
return config;
});
export default API;