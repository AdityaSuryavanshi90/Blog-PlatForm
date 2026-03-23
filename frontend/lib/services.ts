import api from "./axios";

export const loginServices = async (email: string, password: any) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerServices = async (
  name: string,
  email: string,
  password: any,
) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBlogs = async (title: string, content: string) => {
  try {
    const response = await api.post("/blogs", {
      title,
      content,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBlogs = async () => {
  try {
    const reponse = await api.get("/blogs");

    return reponse.data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUserBlogs = async () => {
  try {
    const response = await api.get("/blogs/user");

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBlogById = async (
  id: string,
  title: string,
  content: string,
) => {
  try {
    const response = await api.put(`/blogs/${id}`, { title, content });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBlogById = async (id: string) => {
  try {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBlogById = async (id: string) => {
  try {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (file: any) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/upload", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
