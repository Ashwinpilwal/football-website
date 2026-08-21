import api from "../utils/axios.utils";

const followToggle = async (username) => {
    try {
        const response = await api.post(`/follow/toggle-follow/${username}`);
        return response.data;
    } catch (error) {
        console.log(error?.response?.data);
        throw error;
    }
};

const getMyFollowers = async (page, limit) => {
    try {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        const queryString = params.toString() ? `?${params.toString()}` : "";
        const response = await api.get(`/follow/my-followers${queryString}`);
        return response.data;
    } catch (error) {
        console.log(error?.response?.data);
        throw error;
    }
};

const getUserFollowers = async (username, page, limit) => {
    try {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        const queryString = params.toString() ? `?${params.toString()}` : "";
        const response = await api.get(`/follow/followers/${username}${queryString}`);
        return response.data;
    } catch (error) {
        console.log(error?.response?.data);
        throw error;
    }
};

const getUserFollowing = async (username, page, limit) => {
    try {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        const queryString = params.toString() ? `?${params.toString()}` : "";
        const response = await api.get(`/follow/following/${username}${queryString}`);
        return response.data;
    } catch (error) {
        console.log(error?.response?.data);
        throw error;
    }
};

const getMyFollowing = async (page, limit) => {
    try {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        const queryString = params.toString() ? `?${params.toString()}` : "";
        const response = await api.get(`/follow/my-following${queryString}`);
        return response.data;
    } catch (error) {
        console.log(error?.response?.data);
        throw error;
    }
};

export { followToggle, getMyFollowers, getUserFollowers, getUserFollowing, getMyFollowing };