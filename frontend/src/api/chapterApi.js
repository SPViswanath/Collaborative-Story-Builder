import axios from "axios";

const API = axios.create({
    baseURL : "https://localhost:5000/api",
    withCredentials: true
});

export const getSidebar = (storyId) => 
        API.get(`/chapters/sidebar/${storyId}`);

export const getChapterContent = (chapterId)=>
        API.get(`/chapter/content/${chapterId}`);