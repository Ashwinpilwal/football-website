import api from "../utils/axios.utils";

export const postService = {
  createPost: async (formData) => {
    const response = await api.post("/posts/create-post", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getAllPosts: async () => {
    const response = await api.get("/posts/all-posts");
    return response.data;
  },

  getUserPosts: async (userId, params = {}) => {
    const response = await api.get(`/posts/user/${userId}`, { params });
    return response.data;
  },

  getSectionPosts: async (sectionId) => {
    const response = await api.get(`/posts/section/${sectionId}`);
    return response.data;
  },

  getPostById: async (postId) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  updatePost: async (postId, data) => {
    const response = await api.patch(`/posts/${postId}`, data);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },
};

export const likeService = {
  togglePostLike: async (postId) => {
    const response = await api.post(`/likes/toggle-post-like/${postId}`);
    return response.data;
  },

  toggleCommentLike: async (commentId) => {
    const response = await api.post(`/likes/toggle-comment-like/${commentId}`);
    return response.data;
  },

  toggleTweetLike: async (tweetId) => {
    const response = await api.post(`/likes/toggle-tweet-like/${tweetId}`);
    return response.data;
  },

  getLikedPosts: async () => {
    const response = await api.get("/likes/get-liked-posts");
    return response.data;
  },
};

export const commentService = {
  addComment: async (postId, contentOrPayload, parentComment = null, replyToUser = null) => {
    let payload = {};
    if (typeof contentOrPayload === "object" && contentOrPayload !== null) {
      payload = contentOrPayload;
    } else {
      payload = {
        content: contentOrPayload,
        parentComment,
        replyToUser,
      };
    }
    const response = await api.post(`/comments/add-comment/${postId}`, payload);
    return response.data;
  },

  showAllComments: async (postId, page = 1, limit = 20) => {
    const response = await api.get(`/comments/show-all-comments/${postId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/delete-comment/${commentId}`);
    return response.data;
  },

  editComment: async (commentId, content) => {
    const response = await api.post(`/comments/edit-comment/${commentId}`, { content });
    return response.data;
  },
};

export const tweetService = {
  createTweet: async (data) => {
    let payload = data;
    let headers = {};
    if (typeof data === "string") {
      payload = { content: data };
    } else if (data instanceof FormData) {
      headers = { "Content-Type": "multipart/form-data" };
    } else if (data && (data.photo || data.image)) {
      const formData = new FormData();
      if (data.content) formData.append("content", data.content);
      if (data.photo) formData.append("photo", data.photo);
      else if (data.image) formData.append("image", data.image);
      payload = formData;
      headers = { "Content-Type": "multipart/form-data" };
    }
    const response = await api.post("/tweets/create-tweet", payload, { headers });
    return response.data;
  },

  getCommunityTweets: async () => {
    const response = await api.get("/tweets/community");
    return response.data;
  },

  getAllTweets: async (username) => {
    const response = await api.get(`/tweets/all-tweets/${username}`);
    return response.data;
  },

  updateTweet: async (tweetId, content) => {
    const response = await api.patch(`/tweets/update-tweet/${tweetId}`, { content });
    return response.data;
  },

  deleteTweet: async (tweetId) => {
    const response = await api.delete(`/tweets/delete-tweet/${tweetId}`);
    return response.data;
  },
};

export const chatService = {
  getOrCreateChat: async (receiverId) => {
    const response = await api.post("/chats/get-chatId", { receiverId });
    return response.data;
  },

  getAllGroupChats: async () => {
    const response = await api.get("/chats/get-all-group-chats");
    return response.data;
  },

  createGroupChat: async (groupName, participants) => {
    const response = await api.post("/chats/create-group-chat", { groupName, participants });
    return response.data;
  },

  getGroupChatDetails: async (chatId) => {
    const response = await api.get(`/chats/get-group-chat-details/${chatId}`);
    return response.data;
  },

  getAllMessages: async (chatId, page, limit) => {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get(`/messages/all-messages/${chatId}${queryString}`);
    return response.data;
  },

  editMessage: async (messageId, newContent) => {
    const response = await api.put(`/messages/edit-message/${messageId}`, { newContent });
    return response.data;
  },

  markMessagesAsSeen: async (chatId) => {
    const response = await api.patch(`/messages/mark-seen/${chatId}`);
    return response.data;
  },

  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/delete-message/${messageId}`);
    return response.data;
  },

  getAllUserChats: async () => {
    const response = await api.get("/chats/my-chats");
    return response.data;
  },

  updateGroupChat: async (chatId, formDataOrObject) => {
    let payload = formDataOrObject;
    let headers = {};
    if (formDataOrObject instanceof FormData) {
      headers = { "Content-Type": "multipart/form-data" };
    }
    const response = await api.put(`/chats/update-group-chat/${chatId}`, payload, { headers });
    return response.data;
  },

  addMembersToGroupChat: async (chatId, memberIds) => {
    const response = await api.post(`/chats/add-members/${chatId}`, { memberIds });
    return response.data;
  },
};

export const videoService = {
  postVideo: async (formData) => {
    const response = await api.post("/videos/postvideo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getAllVideos: async () => {
    const response = await api.get("/videos/allvideos");
    return response.data;
  },

  getUserVideos: async (username) => {
    const response = await api.get(`/videos/allvideos/${username}`);
    return response.data;
  },

  getVideoById: async (videoId) => {
    const response = await api.get(`/videos/video/${videoId}`);
    return response.data;
  },

  deleteVideo: async (videoId) => {
    const response = await api.delete(`/videos/delete-video/${videoId}`);
    return response.data;
  },

  createPlaylist: async (formData) => {
    const response = await api.post("/playlists/create-playlist", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getUserPlaylists: async () => {
    const response = await api.get("/playlists/show-playlists");
    return response.data;
  },
};

export const sectionService = {
  createSection: async (formData) => {
    const response = await api.post("/sections/create-section", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getUserSections: async (username) => {
    const response = await api.get(`/sections/user/${username}`);
    return response.data;
  },

  getMySections: async () => {
    const response = await api.get("/sections/my-sections");
    return response.data;
  },
};
