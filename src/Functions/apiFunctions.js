// API functions for profile management

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Response data
 */
export const updateProfile = async (profileData, token, onUpdateRedux) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Response status:', response.status, 'Response text:', errorText);
      throw new Error(errorText || 'Failed to update profile');
    }

    const result = await response.json();

    // Update Redux state if callback provided
    if (typeof onUpdateRedux === 'function') {
      onUpdateRedux(result);
    }

    return result;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Change user password
 * @param {Object} passwordData - Password data
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Response data
 */
export const changePassword = async (passwordData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to change password');
    }

    return await response.text();
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

/**
 * Get user profile
 * @param {string} token - JWT token
 * @returns {Promise<Object>} User profile data
 */
export const getProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to get profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

/**
 * Refresh user profile data and update Redux store
 * @param {string} token - JWT token
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} updateUserData - Redux action to update user data
 * @returns {Promise<Object>} Updated profile data
 */
export const refreshProfile = async (token, dispatch, updateUserData) => {
  try {
    const profileData = await getProfile(token);

    // Update Redux store with fresh profile data
    dispatch(updateUserData({
      updatedUserData: {
        username: profileData.fullName || profileData.user?.fullName,
        emailOrPhone: profileData.email || profileData.user?.email,
        address: profileData.address || profileData.user?.address
      }
    }));

    return profileData;
  } catch (error) {
    console.error('Refresh profile error:', error);
    throw error;
  }
};