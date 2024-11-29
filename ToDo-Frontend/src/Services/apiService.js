import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchLists = async () => {
    const response = await api.get("/lists");
    return response.data;
};

export const addList = async (name) => {
    const response = await api.post("/lists", { name });
    return response.data;
}

export const updateList = async (id, name) => {
    const response = await api.put(`/lists/${id}`, { name });
    return response.data;
}

export const deleteList = async (id) => {
    const response = await api.delete(`/lists/${id}`);
    return response.data;
}

export const fetchTasks = async (listId) => {
    const response = await api.get(`/tasks/${listId}`);
    return response.data;
};

export const addTask = async ({ listId, description }) => {
    const response = await api.post(`/tasks`, { listId, description });
    return response.data;
};

export const updateTask = async (taskId, { description, isCompleted }) => {
    const response = await api.put(`/tasks/${taskId}`, { description, isCompleted });
    return response.data;
};

export const deleteTask = async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
};