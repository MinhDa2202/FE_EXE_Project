import axios from "axios";

const BASE_URL = "/api/ProductComment";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper function to make API requests
const apiRequest = async ({ url, method, data, requiresAuth = false }) => {
  const config = {
    method,
    url,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    config.data = data;
  }

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export const productCommentService = {
  // Get all comments for a product
  getProductComments: async (productId) => {
    try {
      console.log("Fetching comments for product ID:", productId);
      const response = await apiRequest({
        url: `${BASE_URL}/product/${productId}`,
        method: "GET",
        requiresAuth: true, // Comments require authentication
      });
      console.log("Comments API response:", response);
      return response || []; // Ensure we return an array
    } catch (error) {
      console.error("Error fetching product comments:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 404) {
        console.log("No comments found (404), returning empty array");
        return []; // Return empty array if no comments found
      }
      throw error;
    }
  },

  // Create a new comment
  createComment: async (commentData) => {
    try {
      const response = await apiRequest({
        url: BASE_URL,
        method: "POST",
        data: commentData,
        requiresAuth: true,
      });
      return response;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  // Get a specific comment by ID
  getCommentById: async (commentId) => {
    try {
      const response = await apiRequest({
        url: `${BASE_URL}/${commentId}`,
        method: "GET",
        requiresAuth: true, // Comment details require authentication
      });
      return response;
    } catch (error) {
      console.error("Error fetching comment:", error);
      throw error;
    }
  },

  // Update a comment
  updateComment: async (commentId, updateData) => {
    try {
      const response = await apiRequest({
        url: `${BASE_URL}/${commentId}`,
        method: "PUT",
        data: updateData,
        requiresAuth: true,
      });
      return response;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  // Delete a comment
  deleteComment: async (commentId) => {
    try {
      const response = await apiRequest({
        url: `${BASE_URL}/${commentId}`,
        method: "DELETE",
        requiresAuth: true,
      });
      return response;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  // Helper function to organize comments into threads (parent-child structure)
  organizeCommentsIntoThreads: (comments) => {
    if (!Array.isArray(comments)) return [];

    const commentMap = new Map();
    const rootComments = [];

    // First pass: create map of all comments
    comments.forEach((comment) => {
      commentMap.set(comment.id, {
        ...comment,
        replies: [],
      });
    });

    // Second pass: organize into parent-child structure
    comments.forEach((comment) => {
      if (comment.parentId && comment.parentId !== 0) {
        // This is a reply
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentMap.get(comment.id));
        }
      } else {
        // This is a root comment
        rootComments.push(commentMap.get(comment.id));
      }
    });

    return rootComments;
  },

  // Format comment data for display
  formatCommentForDisplay: (comment) => {
    return {
      id: comment.id,
      userName: comment.userName || "Anonymous",
      comment: comment.content,
      date: new Date(comment.createdAt).toLocaleDateString("vi-VN"),
      userId: comment.userId,
      parentId: comment.parentId,
      replies: comment.replies || [],
    };
  },

  // Format comment data for API submission
  formatCommentForSubmission: (productId, content, parentId = null) => {
    return {
      productId: parseInt(productId),
      content: content.trim(),
      parentId: parentId ? parseInt(parentId) : 0,
    };
  },
};
