import axios from 'axios';

const api = axios.create({
  
  // A or B

  //A) for pure local demoing-testing use this base URL
   //  baseURL: "http://localhost:9000/api", 

  //B) for backend deployed on render.com, use this base URL
  baseURL: import.meta.env.VITE_API_URL ,

  withCredentials: true,// this allows cookies set to be sent in each request(enable clearance pass to be in request)
});

export default api;