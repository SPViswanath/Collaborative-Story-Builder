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

/* ===== CREATE STORY ===== */
export const createStory = (data) =>
 INTERNAL_API.post("/stories", data);


/* Internal: published stories */

export const getPublishedStories = () =>
  INTERNAL_API.get("/stories/published");

// get Ongoing Stories
export const getOngoingStories = () =>
  INTERNAL_API.get("/stories/my/ongoing");


// get published stories
export const getmyPublishedStories  = () =>
  INTERNAL_API.get("/stories/my/published");


/* External: public-domain books */
export const getExternalStories = () =>
  EXTERNAL_API.get("/books");
