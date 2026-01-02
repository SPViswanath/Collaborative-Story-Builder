import axios from "axios";

/* INTERNAL STORIES (your backend) */

const INTERNAL_API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

/* EXTERNAL STORIES (Gutenberg) */

const EXTERNAL_API = axios.create({
  baseURL: "https://gutendex.com"
});

/* Internal: published stories */

export const getPublishedStories = () =>
  INTERNAL_API.get("/stories/published");

/* External: public-domain books */

export const getExternalStories = () =>
  EXTERNAL_API.get("/books");
