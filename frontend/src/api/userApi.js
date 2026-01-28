import API from "./api";

export const updateProfileApi = (data) =>
  API.put("/api/user/profile", data);
