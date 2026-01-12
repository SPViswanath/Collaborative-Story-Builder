import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const login = (data) => API.post("/auth/login", data);

export const signup = (data) => API.post("/auth/signup", data);

export const googleLogin = (token) => API.post("/auth/google", { token });
