import axios from 'axios';
import Cookies from 'js-cookie';

// const API_URL = 'http://localhost:8000/api';
const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized request, checking if token is expired...');
            const token = Cookies.get('auth_token');
            if (token) {
                Cookies.remove('auth_token');
                localStorage.removeItem('auth_user');
            }
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const register = async (userData) => {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('username', userData.username);
    formData.append('password', userData.password);
    formData.append('password_confirmation', userData.password_confirmation);

    if (userData.profile_photo) {
        formData.append('profile_photo', userData.profile_photo);
    }

    const response = await api.post('/register', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
};

export const fetchCurrentUser = async () => {
    const response = await api.get('/user');
    return response.data;
};

export const fetchPosts = async () => {
    const response = await api.get('/posts');
    return response.data;
};

export const fetchPost = async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
};

export const createPost = async (postData) => {
    const formData = new FormData();
    formData.append('content', postData.content);

    if (postData.photo) {
        formData.append('photo', postData.photo);
    }

    const response = await api.post('/posts', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const updatePost = async (id, postData) => {
    const formData = new FormData();
    formData.append('content', postData.content);
    formData.append('_method', 'PUT');

    if (postData.photo) {
        formData.append('photo', postData.photo);
    }

    const response = await api.post(`/posts/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const deletePost = async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
};

export const fetchUserPosts = async () => {
    const response = await api.get('/user/posts');
    return response.data;
};

export const fetchLikedPosts = async () => {
    const response = await api.get('/user/liked-posts');
    return response.data;
};

export const fetchComments = async (postId) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
};

export const createComment = async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
};

export const deleteComment = async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
};

export const togglePostLike = async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
};

export const toggleCommentLike = async (commentId) => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data;
};

export default api;