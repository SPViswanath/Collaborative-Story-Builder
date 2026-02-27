import API from "./api";
import axios from "axios"; // only for external

// internal stories
export const createStory = (data) =>
  API.post("/api/stories", data);

export const getOngoingStories = () =>
  API.get("/api/stories/my/ongoing");

export const getMyPublishedStories = () =>
  API.get("/api/stories/my/published");

export const getPublicPublishedStories = (page = 1, limit = 20) =>
  API.get(`/api/stories/published?page=${page}&limit=${limit}`);

export const addCollaborator = (storyId, email) =>
  API.post(`/api/stories/${storyId}/collaborators`, { email });

export const getCollaborators = (storyId) =>
  API.get(`/api/stories/${storyId}/collaborators`);

export const removeCollaborator = (storyId, collaboratorId) =>
  API.delete(`/api/stories/${storyId}/collaborators/${collaboratorId}`);

export const publishToggle = (storyId) =>
  API.patch(`/api/stories/${storyId}/publish`);

export const deleteStory = (storyId) =>
  API.delete(`/api/stories/${storyId}`);

export const getStoryById = (storyId) =>
  API.get(`/api/stories/${storyId}`);

export const getPublicStoryById = (storyId) =>
  API.get(`/api/stories/public/${storyId}`);

export const updateStory = (storyId, data) =>
  API.patch(`/api/stories/${storyId}`, data);

export const uploadStoryCover = (storyId, file) => {
  const formData = new FormData();
  formData.append("image", file);

  return API.put(`/api/stories/${storyId}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const downloadStoryPDF = (storyId) =>
  API.get(`/api/stories/${storyId}/export/pdf`, {
    responseType: "blob",
  });

/* External Gutenberg API (keep as-is) */
const EXTERNAL_API = axios.create({
  baseURL: "https://gutendex.com",
});

export const getExternalStories = (page = 1) =>
  EXTERNAL_API.get(`/books?page=${page}`);

export const getExternalStoryById = (bookId) =>
  EXTERNAL_API.get(`/books/${bookId}`);

export const fetchExternalTextByUrl = (url) =>
  axios.get(url);
