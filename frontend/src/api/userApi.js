import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const updateProfileApi = (data) => API.put("/api/user/profile", data);
