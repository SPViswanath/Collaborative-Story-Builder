import API from "./api";

// sidebar list
export const getChapterSidebar = (storyId) =>
  API.get(`/api/chapters/sidebar/${storyId}`);

// chapter content
export const getChapterContent = (chapterId) =>
  API.get(`/api/chapters/content/${chapterId}`);

// save chapter content
export const saveChapterContent = (chapterId, content) =>
  API.patch(`/api/chapters/${chapterId}`, { content });

// lock/unlock
export const lockChapter = (chapterId) =>
  API.post(`/api/chapters/${chapterId}/lock`);

export const unlockChapter = (chapterId) =>
  API.post(`/api/chapters/${chapterId}/unlock`);

export const createChapter = (storyId, title, parentChapter = null) =>
  API.post(`/api/chapters/${storyId}`, {
    title,
    parentChapter,
  });

// public
export const getPublicChapterSidebar = (storyId) =>
  API.get(`/api/chapters/public/sidebar/${storyId}`);

export const getPublicChapterContent = (chapterId) =>
  API.get(`/api/chapters/public/content/${chapterId}`);

export const renameChapter = (chapterId, title) =>
  API.patch(`/api/chapters/${chapterId}/rename`, { title });

export const deleteChapter = (chapterId) =>
  API.delete(`/api/chapters/${chapterId}`);
