const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://python-profile-api.vercel.app';

// Helper function để lấy full URL cho ảnh
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // Nếu đã là full URL, trả về nguyên
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  // Nếu là relative path, thêm base URL
  if (imagePath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  // Trả về nguyên nếu không match
  return imagePath;
};

// ========== UPLOAD API ==========
export const uploadImage = async (file, token = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = token 
      ? `${API_BASE_URL}/upload/image?token=${encodeURIComponent(token)}`
      : `${API_BASE_URL}/upload/image`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Upload thất bại');
    return data;
  } catch (error) {
    throw error;
  }
};

export const uploadProductImage = async (file, token = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = token 
      ? `${API_BASE_URL}/upload/product-image?token=${encodeURIComponent(token)}`
      : `${API_BASE_URL}/upload/product-image`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Upload thất bại');
    return data;
  } catch (error) {
    throw error;
  }
};


export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const register = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Registration failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to get current user');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to get profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cập nhật profile trong bảng duong
 * @param {string} token - Access token
 * @param {Object} profileData - Dữ liệu profile cần cập nhật
 * @param {string} [profileData.first_name] - Tên
 * @param {string} [profileData.last_name] - Họ
 * @param {string} [profileData.nickname] - Biệt danh
 * @param {string} [profileData.avatar_url] - URL avatar
 * @param {string} [profileData.cover_url] - URL ảnh bìa
 * @param {string} [profileData.bio] - Tiểu sử
 * @param {string} [profileData.location] - Địa điểm
 * @param {string} [profileData.hometown] - Quê quán
 * @param {string} [profileData.marital_status] - Tình trạng hôn nhân
 * @param {string} [profileData.date_of_birth] - Ngày sinh (YYYY-MM-DD)
 * @param {Object} [profileData.extra] - Dữ liệu bổ sung
 * @returns {Promise<Object>} Response từ API
 */
export const updateProfile = async (token, profileData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ========== IMAGES API ==========
export const getImages = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get images');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createImage = async (token, imageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create image');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateImage = async (token, imageId, imageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/${imageId}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update image');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteImage = async (token, imageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/images/${imageId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete image');
    return data;
  } catch (error) {
    throw error;
  }
};

// ========== EDUCATIONS API ==========
export const getEducations = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/educations?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get educations');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createEducation = async (token, educationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/educations?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(educationData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create education');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateEducation = async (token, educationId, educationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/educations/${educationId}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(educationData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update education');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteEducation = async (token, educationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/educations/${educationId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete education');
    return data;
  } catch (error) {
    throw error;
  }
};

// ========== JOBS API ==========
export const getJobs = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get jobs');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createJob = async (token, jobData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create job');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateJob = async (token, jobId, jobData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update job');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteJob = async (token, jobId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete job');
    return data;
  } catch (error) {
    throw error;
  }
};

// ========== LANGUAGES API ==========
export const getLanguages = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get languages');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createLanguage = async (token, languageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(languageData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create language');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateLanguage = async (token, languageId, languageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages/${languageId}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(languageData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update language');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteLanguage = async (token, languageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages/${languageId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete language');
    return data;
  } catch (error) {
    throw error;
  }
};

// ========== CONTRACTS API ==========
export const getContracts = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get contracts');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createContract = async (token, contractData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create contract');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateContract = async (token, contractId, contractData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contractData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update contract');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteContract = async (token, contractId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete contract');
    return data;
  } catch (error) {
    throw error;
  }
};

// ========== ACHIEVEMENTS API ==========
export const getAchievements = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get achievements');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createAchievement = async (token, achievementData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(achievementData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create achievement');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateAchievement = async (token, achievementId, achievementData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/${achievementId}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(achievementData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update achievement');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteAchievement = async (token, achievementId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/achievements/${achievementId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete achievement');
    return data;
  } catch (error) {
    throw error;
  }
};

// ========== PRODUCTS API ==========
export const getProducts = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get products');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (token, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create product');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (token, productId, productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update product');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (token, productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete product');
    return data;
  } catch (error) {
    throw error;
  }
};

// ========== PRODUCT IMAGES API ==========
export const getProductImages = async (token, productId = null) => {
  try {
    const url = productId 
      ? `${API_BASE_URL}/product-images?token=${encodeURIComponent(token)}&product_id=${productId}`
      : `${API_BASE_URL}/product-images?token=${encodeURIComponent(token)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get product images');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createProductImage = async (token, productImageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product-images?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productImageData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create product image');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateProductImage = async (token, imageId, productImageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product-images/${imageId}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productImageData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update product image');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteProductImage = async (token, imageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/product-images/${imageId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete product image');
    return data;
  } catch (error) {
    throw error;
  }
};

// ========== SKILLS API ==========
export const getSkills = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get skills');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createSkill = async (token, skillData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skillData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create skill');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateSkill = async (token, skillId, skillData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills/${skillId}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(skillData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update skill');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteSkill = async (token, skillId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills/${skillId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete skill');
    return data;
  } catch (error) {
    throw error;
  }
};

// ========== TARGETS API ==========
export const getTargets = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/targets?token=${encodeURIComponent(token)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get targets');
    return data;
  } catch (error) {
    throw error;
  }
};

export const createTarget = async (token, targetData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/targets?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(targetData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to create target');
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateTarget = async (token, targetId, targetData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/targets/${targetId}?token=${encodeURIComponent(token)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(targetData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to update target');
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteTarget = async (token, targetId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/targets/${targetId}?token=${encodeURIComponent(token)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to delete target');
    return data;
  } catch (error) {
    throw error;
  }
};

// ========== PUBLIC API (Không cần token) ==========
export const getPublicProfileAll = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/public/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || 'Failed to get public profile');
    return data;
  } catch (error) {
    throw error;
  }
};


