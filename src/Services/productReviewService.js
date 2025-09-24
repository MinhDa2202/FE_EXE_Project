import axios from "axios";

const BASE_URL = "https://schand20250922153400.azurewebsites.net/api/ProductReview";

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

export const productReviewService = {
  // Get all reviews for a product
  getProductReviews: async (productId) => {
    try {
      console.log("Fetching reviews for product ID:", productId);
      const response = await apiRequest({
        url: `${BASE_URL}/${productId}`,
        method: "GET",
        requiresAuth: true, // Reviews require authentication
      });
      console.log("Reviews API response:", response);
      return response || []; // Ensure we return an array
    } catch (error) {
      console.error("Error fetching product reviews:", error);
      console.error("Error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 404) {
        console.log("No reviews found (404), returning empty array");
        return []; // Return empty array if no reviews found
      }
      throw error;
    }
  },

  // Get detailed review by ID
  getReviewDetails: async (reviewId) => {
    try {
      const response = await apiRequest({
        url: `${BASE_URL}/details/${reviewId}`,
        method: "GET",
        requiresAuth: true, // Review details require authentication
      });
      return response;
    } catch (error) {
      console.error("Error fetching review details:", error);
      throw error;
    }
  },

  // Create a new review
  createReview: async (reviewData) => {
    try {
      const response = await apiRequest({
        url: BASE_URL,
        method: "POST",
        data: reviewData,
        requiresAuth: true,
      });
      return response;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  // Update a review
  updateReview: async (reviewId, updateData) => {
    try {
      const response = await apiRequest({
        url: `${BASE_URL}/${reviewId}`,
        method: "PUT",
        data: updateData,
        requiresAuth: true,
      });
      return response;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const response = await apiRequest({
        url: `${BASE_URL}/${reviewId}`,
        method: "DELETE",
        requiresAuth: true,
      });
      return response;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },

  // Calculate average rating from reviews
  calculateAverageRating: (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  },

  // Get rating distribution
  getRatingDistribution: (reviews) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (!Array.isArray(reviews)) return distribution;

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });
    return distribution;
  },

  // Format review data for display
  formatReviewForDisplay: (review) => {
    return {
      id: review.id,
      userName: review.userName || "Anonymous User",
      rating: review.rating,
      title: review.title || "", // API doesn't have title, might need to extract from content
      comment: review.reviewContent,
      date: new Date(review.createdAt).toLocaleDateString("vi-VN"),
      helpful: 0, // API doesn't have helpful count, default to 0
      avatar: null, // API doesn't have avatar, default to null
      isVerifiedPurchase: review.isVerifiedPurchase || false,
      userId: review.userId,
    };
  },

  // Format review data for API submission
  formatReviewForSubmission: (productId, rating, reviewContent, title = "") => {
    // Combine title and content if title exists
    const fullContent = title ? `${title}\n\n${reviewContent}` : reviewContent;

    return {
      productId: parseInt(productId),
      rating: parseInt(rating),
      reviewContent: fullContent.trim(),
      isVerifiedPurchase: true, // Default to true, can be modified based on business logic
    };
  },

  // Extract title from review content (if formatted with title)
  extractTitleFromContent: (content) => {
    if (!content) return { title: "", content: "" };

    const lines = content.split("\n");
    if (lines.length > 2 && lines[1] === "") {
      // If second line is empty, first line might be title
      return {
        title: lines[0],
        content: lines.slice(2).join("\n"),
      };
    }

    return {
      title: "",
      content: content,
    };
  },

  // Validate review data before submission
  validateReviewData: (rating, content, title = "") => {
    const errors = [];

    if (!rating || rating < 1 || rating > 5) {
      errors.push("Vui lòng chọn đánh giá từ 1 đến 5 sao");
    }

    if (!content || content.trim().length < 10) {
      errors.push("Nội dung đánh giá phải có ít nhất 10 ký tự");
    }

    if (title && title.length > 100) {
      errors.push("Tiêu đề không được vượt quá 100 ký tự");
    }

    if (content && content.length > 1000) {
      errors.push("Nội dung đánh giá không được vượt quá 1000 ký tự");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
