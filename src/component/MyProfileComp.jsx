import React, { useState, useEffect } from 'react';
import {
  getProfile,
  updateProfile,
  getImages,
  getEducations,
  getJobs,
  getLanguages,
  getContracts,
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImages,
  createProductImage,
  updateProductImage,
  deleteProductImage,
  createImage,
  updateImage,
  deleteImage,
  createEducation,
  updateEducation,
  deleteEducation,
  createJob,
  updateJob,
  deleteJob,
  createLanguage,
  updateLanguage,
  deleteLanguage,
  createContract,
  updateContract,
  deleteContract,
  getImageUrl,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getTargets,
  createTarget,
  updateTarget,
  deleteTarget,
} from '../api/API';
import './ProfileComp.css';
import HeaderComp from './HeaderComp';
import FooterComp from './FooterComp';
import EditProfileModal from './EditProfileModal';
import EditImageModal from './EditImageModal';
import EditEducationModal from './EditEducationModal';
import EditJobModal from './EditJobModal';
import EditLanguageModal from './EditLanguageModal';
import EditContractModal from './EditContractModal';
import EditAchievementModal from './EditAchievementModal';
import EditProductModal from './EditProductModal';
import EditProductImageModal from './EditProductImageModal';
import EditSkillModal from './EditSkillModal';
import EditTargetModal from './EditTargetModal';
import './MyProfileComp.css';
import { getToken, logout } from '../authen/authen';

const MyProfileComp = () => {
  const token = getToken();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [images, setImages] = useState([]);
  const [educations, setEducations] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [targets, setTargets] = useState([]);

  // Modal states
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [editImageModal, setEditImageModal] = useState({ open: false, image: null, mode: 'create' });
  const [editEducationModal, setEditEducationModal] = useState({ open: false, education: null, mode: 'create' });
  const [editJobModal, setEditJobModal] = useState({ open: false, job: null, mode: 'create' });
  const [editLanguageModal, setEditLanguageModal] = useState({ open: false, language: null, mode: 'create' });
  const [editContractModal, setEditContractModal] = useState({ open: false, contract: null, mode: 'create' });
  const [editAchievementModal, setEditAchievementModal] = useState({ open: false, achievement: null, mode: 'create' });
  const [editProductModal, setEditProductModal] = useState({ open: false, product: null, mode: 'create' });
  const [editProductImageModal, setEditProductImageModal] = useState({ open: false, productImage: null, productId: null, mode: 'create' });
  const [editSkillModal, setEditSkillModal] = useState({ open: false, skill: null, mode: 'create' });
  const [editTargetModal, setEditTargetModal] = useState({ open: false, target: null, mode: 'create' });

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, imagesRes, educationsRes, jobsRes, languagesRes, contractsRes, achievementsRes, productsRes, productImagesRes, skillsRes, targetsRes] = await Promise.all([
        getProfile(token),
        getImages(token),
        getEducations(token),
        getJobs(token),
        getLanguages(token),
        getContracts(token),
        getAchievements(token),
        getProducts(token),
        getProductImages(token),
        getSkills(token),
        getTargets(token),
      ]);

      // Load và hiển thị từng phần để có progressive loading
      if (profileRes) {
        setProfile(profileRes);
      }
      
      setTimeout(() => {
        setImages(imagesRes.data || []);
        setEducations(educationsRes.data || []);
      }, 100);
      
      setTimeout(() => {
        setJobs(jobsRes.data || []);
        setLanguages(languagesRes.data || []);
        setSkills(skillsRes.data || []);
      }, 150);
      
      setTimeout(() => {
        setContracts(contractsRes.data || []);
        setAchievements(achievementsRes.data || []);
      }, 200);
      
      setTimeout(() => {
        setProducts(productsRes.data || []);
        setProductImages(productImagesRes.data || []);
        setTargets(targetsRes.data || []);
        setLoading(false);
      }, 250);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.message.includes('Invalid token') || error.message.includes('401')) {
        logout();
        window.location.href = '/login';
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      await updateProfile(token, profileData);
      await loadData();
      setEditProfileModal(false);
    } catch (error) {
      alert('Cập nhật profile thất bại: ' + error.message);
    }
  };

  const handleImageSave = async (imageData, imageId) => {
    try {
      if (imageId) {
        await updateImage(token, imageId, imageData);
      } else {
        await createImage(token, imageData);
      }
      await loadData();
      setEditImageModal({ open: false, image: null, mode: 'create' });
    } catch (error) {
      alert('Lưu hình ảnh thất bại: ' + error.message);
    }
  };

  const handleImageDelete = async (imageId) => {
    if (window.confirm('Bạn có chắc muốn xóa hình ảnh này?')) {
      try {
        await deleteImage(token, imageId);
        await loadData();
      } catch (error) {
        alert('Xóa hình ảnh thất bại: ' + error.message);
      }
    }
  };

  const handleEducationSave = async (educationData, educationId) => {
    try {
      if (educationId) {
        await updateEducation(token, educationId, educationData);
      } else {
        await createEducation(token, educationData);
      }
      await loadData();
      setEditEducationModal({ open: false, education: null, mode: 'create' });
    } catch (error) {
      alert('Lưu học vấn thất bại: ' + error.message);
    }
  };

  const handleEducationDelete = async (educationId) => {
    if (window.confirm('Bạn có chắc muốn xóa học vấn này?')) {
      try {
        await deleteEducation(token, educationId);
        await loadData();
      } catch (error) {
        alert('Xóa học vấn thất bại: ' + error.message);
      }
    }
  };

  const handleJobSave = async (jobData, jobId) => {
    try {
      if (jobId) {
        await updateJob(token, jobId, jobData);
      } else {
        await createJob(token, jobData);
      }
      await loadData();
      setEditJobModal({ open: false, job: null, mode: 'create' });
    } catch (error) {
      alert('Lưu công việc thất bại: ' + error.message);
    }
  };

  const handleJobDelete = async (jobId) => {
    if (window.confirm('Bạn có chắc muốn xóa công việc này?')) {
      try {
        await deleteJob(token, jobId);
        await loadData();
      } catch (error) {
        alert('Xóa công việc thất bại: ' + error.message);
      }
    }
  };

  const handleLanguageSave = async (languageData, languageId) => {
    try {
      if (languageId) {
        await updateLanguage(token, languageId, languageData);
      } else {
        await createLanguage(token, languageData);
      }
      await loadData();
      setEditLanguageModal({ open: false, language: null, mode: 'create' });
    } catch (error) {
      alert('Lưu ngôn ngữ thất bại: ' + error.message);
    }
  };

  const handleLanguageDelete = async (languageId) => {
    if (window.confirm('Bạn có chắc muốn xóa ngôn ngữ này?')) {
      try {
        await deleteLanguage(token, languageId);
        await loadData();
      } catch (error) {
        alert('Xóa ngôn ngữ thất bại: ' + error.message);
      }
    }
  };

  const handleContractSave = async (contractData, contractId) => {
    try {
      if (contractId) {
        await updateContract(token, contractId, contractData);
      } else {
        await createContract(token, contractData);
      }
      await loadData();
      setEditContractModal({ open: false, contract: null, mode: 'create' });
    } catch (error) {
      alert('Lưu hợp đồng thất bại: ' + error.message);
    }
  };

  const handleContractDelete = async (contractId) => {
    if (window.confirm('Bạn có chắc muốn xóa hợp đồng này?')) {
      try {
        await deleteContract(token, contractId);
        await loadData();
      } catch (error) {
        alert('Xóa hợp đồng thất bại: ' + error.message);
      }
    }
  };

  const handleAchievementSave = async (achievementData, achievementId) => {
    try {
      if (achievementId) {
        await updateAchievement(token, achievementId, achievementData);
      } else {
        await createAchievement(token, achievementData);
      }
      await loadData();
      setEditAchievementModal({ open: false, achievement: null, mode: 'create' });
    } catch (error) {
      alert('Lưu thành tựu thất bại: ' + error.message);
    }
  };

  const handleAchievementDelete = async (achievementId) => {
    if (window.confirm('Bạn có chắc muốn xóa thành tựu này?')) {
      try {
        await deleteAchievement(token, achievementId);
        await loadData();
      } catch (error) {
        alert('Xóa thành tựu thất bại: ' + error.message);
      }
    }
  };

  const handleProductSave = async (productData, productId) => {
    try {
      const { product_images, ...productInfo } = productData;
      
      // Lưu product (ảnh đầu tiên đã được lưu vào product_image)
      let savedProduct;
      if (productId) {
        savedProduct = await updateProduct(token, productId, productInfo);
      } else {
        savedProduct = await createProduct(token, productInfo);
      }
      
      const finalProductId = savedProduct.data?.id || productId;
      
      // Nếu đang edit, xóa tất cả ảnh cũ của product này trước
      if (productId && finalProductId) {
        const existingProductImages = productImages.filter(img => img.product_id === finalProductId);
        for (const img of existingProductImages) {
          await deleteProductImage(token, img.id);
        }
      }
      
      // Nếu có ảnh thứ 2 trở đi, lưu vào productImages (với description)
      if (product_images && product_images.length > 0 && finalProductId) {
        // Tạo các ảnh mới với description
        for (const imageData of product_images) {
          if (imageData.image_url && imageData.image_url.trim()) {
            await createProductImage(token, {
              product_id: finalProductId,
              image_url: imageData.image_url,
              description: imageData.description || '',
            });
          }
        }
      }
      
      await loadData();
      setEditProductModal({ open: false, product: null, mode: 'create' });
    } catch (error) {
      alert('Lưu sản phẩm thất bại: ' + error.message);
    }
  };

  const handleProductDelete = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này? Tất cả ảnh sản phẩm cũng sẽ bị xóa.')) {
      try {
        await deleteProduct(token, productId);
        await loadData();
      } catch (error) {
        alert('Xóa sản phẩm thất bại: ' + error.message);
      }
    }
  };

  const handleProductImageSave = async (productImageData, imageId) => {
    try {
      if (imageId) {
        await updateProductImage(token, imageId, productImageData);
      } else {
        await createProductImage(token, productImageData);
      }
      await loadData();
      setEditProductImageModal({ open: false, productImage: null, productId: null, mode: 'create' });
    } catch (error) {
      alert('Lưu ảnh sản phẩm thất bại: ' + error.message);
    }
  };

  const handleSkillSave = async (skillData, skillId) => {
    try {
      if (skillId) {
        await updateSkill(token, skillId, skillData);
      } else {
        await createSkill(token, skillData);
      }
      await loadData();
      setEditSkillModal({ open: false, skill: null, mode: 'create' });
    } catch (error) {
      alert('Lưu kỹ năng thất bại: ' + error.message);
    }
  };

  const handleSkillDelete = async (skillId) => {
    if (window.confirm('Bạn có chắc muốn xóa kỹ năng này?')) {
      try {
        await deleteSkill(token, skillId);
        await loadData();
      } catch (error) {
        alert('Xóa kỹ năng thất bại: ' + error.message);
      }
    }
  };

  const handleTargetSave = async (targetData, targetId) => {
    try {
      if (targetId) {
        await updateTarget(token, targetId, targetData);
      } else {
        await createTarget(token, targetData);
      }
      await loadData();
      setEditTargetModal({ open: false, target: null, mode: 'create' });
    } catch (error) {
      alert('Lưu mục tiêu thất bại: ' + error.message);
    }
  };

  const handleTargetDelete = async (targetId) => {
    if (window.confirm('Bạn có chắc muốn xóa mục tiêu này?')) {
      try {
        await deleteTarget(token, targetId);
        await loadData();
      } catch (error) {
        alert('Xóa mục tiêu thất bại: ' + error.message);
      }
    }
  };

  const handleProductImageDelete = async (imageId) => {
    if (window.confirm('Bạn có chắc muốn xóa ảnh sản phẩm này?')) {
      try {
        await deleteProductImage(token, imageId);
        await loadData();
      } catch (error) {
        alert('Xóa ảnh sản phẩm thất bại: ' + error.message);
      }
    }
  };

  // Luôn hiển thị UI với skeleton loading, không block với spinner

  return (
    <div className="my-profile-container">
      {/* Header */}
      <HeaderComp />

      <div className="editable-sections">
        <div className="profile-container">
          {/* Cover Image */}
          <div className="cover-section">
            {loading && !profile ? (
              <div className="cover-placeholder skeleton-pulse">
                <div className="skeleton-shimmer"></div>
              </div>
            ) : profile?.data?.cover_url || profile?.cover_url ? (
              <img src={getImageUrl(profile?.data?.cover_url || profile?.cover_url)} alt="Cover" className="cover-image fade-in" />
            ) : (
              <div className="cover-placeholder"></div>
            )}
          </div>

          {/* Profile Header */}
          {loading && !profile ? (
            <div className="profile-header">
              <div className="avatar-section">
                <div className="avatar-placeholder skeleton-pulse">
                  <div className="skeleton-shimmer"></div>
                </div>
              </div>
              <div className="profile-info">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-subtitle"></div>
                <div className="skeleton-line skeleton-text"></div>
              </div>
            </div>
          ) : (
            <div className="profile-header fade-in">
              <div className="profile-edit-overlay" onClick={() => setEditProfileModal(true)}>
                <span className="edit-icon">✏️</span>
              </div>
              <div className="avatar-section">
                {(profile?.data?.avatar_url || profile?.avatar_url) ? (
                  <img src={getImageUrl(profile?.data?.avatar_url || profile?.avatar_url)} alt="Avatar" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    {(profile?.data?.first_name?.[0] || profile?.first_name?.[0] || profile?.data?.nickname?.[0] || profile?.nickname?.[0] || 'U')}
                  </div>
                )}
              </div>
              <div className="profile-info">
                <h1 className="profile-name">
                  {(profile?.data?.first_name || profile?.first_name) || (profile?.data?.last_name || profile?.last_name)
                    ? `${profile?.data?.first_name || profile?.first_name || ''} ${profile?.data?.last_name || profile?.last_name || ''}`.trim()
                    : profile?.data?.nickname || profile?.nickname || 'Chưa có tên'}
                </h1>
                {(profile?.data?.nickname || profile?.nickname) && (
                  <p className="profile-nickname">@{profile?.data?.nickname || profile?.nickname}</p>
                )}
                {(profile?.data?.bio || profile?.bio) && <p className="profile-bio">{profile?.data?.bio || profile?.bio}</p>}
                <div className="profile-meta">
                  {(profile?.data?.location || profile?.location) && (
                    <span className="meta-item">
                      <span className="meta-icon">📍</span> {profile?.data?.location || profile?.location}
                    </span>
                  )}
                  {(profile?.data?.hometown || profile?.hometown) && (
                    <span className="meta-item">
                      <span className="meta-icon">🏠</span> {profile?.data?.hometown || profile?.hometown}
                    </span>
                  )}
                  {(profile?.data?.date_of_birth || profile?.date_of_birth) && (
                    <span className="meta-item">
                      <span className="meta-icon">🎂</span> {new Date(profile?.data?.date_of_birth || profile?.date_of_birth).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  )}
                  {(profile?.data?.marital_status || profile?.marital_status) && (
                    <span className="meta-item">
                      <span className="meta-icon">💍</span> {profile?.data?.marital_status || profile?.marital_status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Target Section - Full width, between profile header and main content */}
          <section className="profile-section editable-section target-section">
            <div className="section-header">
              <h2 className="section-title">Mục Tiêu Nghề Nghiệp</h2>
              <button
                className="add-btn"
                onClick={() => setEditTargetModal({ open: true, target: null, mode: 'create' })}
              >
                + Thêm mục tiêu
              </button>
            </div>
            {loading && targets.length === 0 ? (
              <div className="target-content">
                <div className="target-item skeleton-pulse">
                  <div className="skeleton-line skeleton-text-line"></div>
                  <div className="skeleton-line skeleton-text-line"></div>
                </div>
              </div>
            ) : targets && targets.length > 0 ? (
              <div className="target-content fade-in">
                {targets.map((target) => (
                  <div key={target.id} className="target-item editable-item">
                    <div className="item-edit-controls">
                      <button
                        className="edit-item-btn"
                        onClick={() => setEditTargetModal({ open: true, target, mode: 'edit' })}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-item-btn"
                        onClick={() => handleTargetDelete(target.id)}
                      >
                        🗑️
                      </button>
                    </div>
                    <p className="target-text">{target.target}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Chưa có mục tiêu nghề nghiệp nào</p>
            )}
          </section>

          {/* Profile Content - Grid Layout */}
          <div className="profile-content">
            {/* Sidebar - Left Column */}
            <div className="profile-sidebar">
              {/* Skills Section - Above Languages */}
              <section className="profile-section editable-section">
                <div className="section-header">
                  <h2 className="section-title">Kỹ Năng</h2>
                  <button
                    className="add-btn"
                    onClick={() => setEditSkillModal({ open: true, skill: null, mode: 'create' })}
                  >
                    + Thêm kỹ năng
                  </button>
                </div>
                {skills && skills.length > 0 ? (
                  <div className="skills-grid">
                    {skills.map((skill) => (
                      <div key={skill.id} className="skill-item editable-item">
                        <div className="item-edit-controls">
                          <button
                            className="edit-item-btn"
                            onClick={() => setEditSkillModal({ open: true, skill, mode: 'edit' })}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-item-btn"
                            onClick={() => handleSkillDelete(skill.id)}
                          >
                            🗑️
                          </button>
                        </div>
                        <span className="skill-name">{skill.skill_name}</span>
                        <span className="skill-level">{skill.level}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Chưa có kỹ năng nào</p>
                )}
              </section>

              {/* Languages Section */}
              <section className="profile-section editable-section">
                <div className="section-header">
                  <h2 className="section-title">Ngôn Ngữ</h2>
                  <button
                    className="add-btn"
                    onClick={() => setEditLanguageModal({ open: true, language: null, mode: 'create' })}
                  >
                    + Thêm
                  </button>
                </div>
                {languages && languages.length > 0 ? (
                  <div className="skills-grid">
                    {languages.map((lang) => (
                      <div key={lang.id} className="skill-item editable-item">
                        <div className="item-edit-controls">
                          <button
                            className="edit-item-btn"
                            onClick={() => setEditLanguageModal({ open: true, language: lang, mode: 'edit' })}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-item-btn"
                            onClick={() => handleLanguageDelete(lang.id)}
                          >
                            🗑️
                          </button>
                        </div>
                        <span className="skill-name">{lang.language}</span>
                        <span className="skill-level">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Chưa có ngôn ngữ nào</p>
                )}
              </section>

              {/* Images Section */}
              <section className="profile-section editable-section">
                <div className="section-header">
                  <h2 className="section-title">Hình Ảnh</h2>
                  <button
                    className="add-btn"
                    onClick={() => setEditImageModal({ open: true, image: null, mode: 'create' })}
                  >
                    + Thêm
                  </button>
                </div>
                {images && images.length > 0 ? (
                  <div className="images-grid-sidebar">
                    {images.map((image) => (
                      <div key={image.id} className="image-item editable-item">
                        <div className="item-edit-controls">
                          <button
                            className="edit-item-btn"
                            onClick={() => setEditImageModal({ open: true, image, mode: 'edit' })}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-item-btn"
                            onClick={() => handleImageDelete(image.id)}
                          >
                            🗑️
                          </button>
                        </div>
                        <img src={getImageUrl(image.images_url)} alt={image.image_type} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Chưa có hình ảnh nào</p>
                )}
              </section>

              {/* Contacts Section */}
              <section className="profile-section editable-section">
                <div className="section-header">
                  <h2 className="section-title">Liên Hệ</h2>
                  <button
                    className="add-btn"
                    onClick={() => setEditContractModal({ open: true, contract: null, mode: 'create' })}
                  >
                    + Thêm
                  </button>
                </div>
                {contracts && contracts.length > 0 ? (
                  <div className="contacts-list-compact">
                    {contracts.map((contract) => (
                      <div key={contract.id} className="contact-item-compact editable-item">
                        <div className="item-edit-controls">
                          <button
                            className="edit-item-btn"
                            onClick={() => setEditContractModal({ open: true, contract, mode: 'edit' })}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-item-btn"
                            onClick={() => handleContractDelete(contract.id)}
                          >
                            🗑️
                          </button>
                        </div>
                        <span className="contact-info">
                          {contract.status === 'email' && '📧 '}
                          {contract.status === 'phone' && '📱 '}
                          {contract.status === 'zalo' && '💬 '}
                          {contract.contract_name}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Chưa có thông tin liên hệ nào</p>
                )}
              </section>
            </div>

            {/* Main Content - Right Column */}
            <div className="profile-main">
              {/* Educations Section with Edit Controls */}
              <section className="profile-section editable-section">
                <div className="section-header">
                  <h2 className="section-title">Học Vấn</h2>
                  <button
                    className="add-btn"
                    onClick={() => setEditEducationModal({ open: true, education: null, mode: 'create' })}
                  >
                    + Thêm học vấn
                  </button>
                </div>
                {educations && educations.length > 0 ? (
                  <div className="timeline">
                    {educations.map((edu) => (
                      <div key={edu.id} className="timeline-item editable-item">
                        <div className="timeline-content">
                          <div className="item-edit-controls">
                            <button
                              className="edit-item-btn"
                              onClick={() => setEditEducationModal({ open: true, education: edu, mode: 'edit' })}
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-item-btn"
                              onClick={() => handleEducationDelete(edu.id)}
                            >
                              🗑️
                            </button>
                          </div>
                          <h3 className="timeline-title">{edu.school_name}</h3>
                          <div className="timeline-date">
                            {edu.start_year && new Date(edu.start_year).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' })}
                            {edu.start_year && edu.end_year && ' - '}
                            {edu.end_year && new Date(edu.end_year).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' })}
                          </div>
                          {edu.description && <p className="timeline-description">{edu.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Chưa có học vấn nào</p>
                )}
              </section>

              {/* Jobs Section with Edit Controls */}
              <section className="profile-section editable-section">
                <div className="section-header">
                  <h2 className="section-title">Kinh Nghiệm Làm Việc</h2>
                  <button
                    className="add-btn"
                    onClick={() => setEditJobModal({ open: true, job: null, mode: 'create' })}
                  >
                    + Thêm công việc
                  </button>
                </div>
                {jobs && jobs.length > 0 ? (
                  <div className="timeline">
                    {jobs.map((job) => (
                      <div key={job.id} className="timeline-item editable-item">
                        <div className="timeline-content">
                          <div className="item-edit-controls">
                            <button
                              className="edit-item-btn"
                              onClick={() => setEditJobModal({ open: true, job, mode: 'edit' })}
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-item-btn"
                              onClick={() => handleJobDelete(job.id)}
                            >
                              🗑️
                            </button>
                          </div>
                          <h3 className="timeline-title">
                            {job.job_name ? `${job.job_name} - ${job.company_name}` : job.company_name}
                          </h3>
                          <div className="timeline-date">
                            {job.start_date && new Date(job.start_date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long' })}
                            {job.start_date && job.end_date && ' - '}
                            {job.end_date || 'Hiện tại'}
                          </div>
                          {job.description && <p className="timeline-description">{job.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Chưa có kinh nghiệm làm việc nào</p>
                )}
              </section>

              {/* Achievements Section with Edit Controls */}
              <section className="profile-section editable-section">
                <div className="section-header">
                  <h2 className="section-title">Thành Tựu</h2>
                  <button
                    className="add-btn"
                    onClick={() => setEditAchievementModal({ open: true, achievement: null, mode: 'create' })}
                  >
                    + Thêm thành tựu
                  </button>
                </div>
                {achievements && achievements.length > 0 ? (
                  <div className="achievements-list">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="achievement-item editable-item">
                        <div className="item-edit-controls">
                          <button
                            className="edit-item-btn"
                            onClick={() => setEditAchievementModal({ open: true, achievement, mode: 'edit' })}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-item-btn"
                            onClick={() => handleAchievementDelete(achievement.id)}
                          >
                            🗑️
                          </button>
                        </div>
                        <h3 className="achievement-name">{achievement.achievement_name}</h3>
                        {achievement.description && (
                          <p className="achievement-description">{achievement.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">Chưa có thành tựu nào</p>
                )}
              </section>

              {/* Products Section with Edit Controls */}
              <section className="profile-section editable-section">
                <div className="section-header">
                  <h2 className="section-title">Sản Phẩm</h2>
                  <button
                    className="add-btn"
                    onClick={() => setEditProductModal({ open: true, product: null, mode: 'create' })}
                  >
                    + Thêm sản phẩm
                  </button>
                </div>
                {products && products.length > 0 ? (
                  <div className="products-grid">
                    {products.map((product) => {
                      const productImgs = productImages.filter(img => img.product_id === product.id);
                      return (
                        <div key={product.id} className="product-card editable-item">
                          <div className="item-edit-controls">
                            <button
                              className="edit-item-btn"
                              onClick={() => setEditProductModal({ open: true, product, mode: 'edit' })}
                            >
                              ✏️
                            </button>
                            <button
                              className="delete-item-btn"
                              onClick={() => handleProductDelete(product.id)}
                            >
                              🗑️
                            </button>
                            <button
                              className="add-image-btn"
                              onClick={() => setEditProductImageModal({ open: true, productImage: null, productId: product.id, mode: 'create' })}
                              title="Thêm ảnh sản phẩm"
                            >
                              📷
                            </button>
                          </div>
                          {product.product_image && (
                            <div className="product-image">
                              <img src={getImageUrl(product.product_image)} alt={product.product_name} />
                            </div>
                          )}
                          <div className="product-info">
                            <h3 className="product-name">
                              {product.product_url ? (
                                <a href={product.product_url} target="_blank" rel="noopener noreferrer">
                                  {product.product_name}
                                </a>
                              ) : (
                                product.product_name
                              )}
                            </h3>
                            {productImgs.length > 0 ? (
                              <div className="product-images-section">
                                <div className="product-images-header">
                                  <span className="product-images-count">Ảnh mô tả ({productImgs.length})</span>
                                </div>
                                <div className="product-images-grid">
                                  {productImgs.map((img) => (
                                    <div key={img.id} className="product-img-item editable-item">
                                      <div className="item-edit-controls">
                                        <button
                                          className="edit-item-btn"
                                          onClick={() => setEditProductImageModal({ open: true, productImage: img, productId: product.id, mode: 'edit' })}
                                        >
                                          ✏️
                                        </button>
                                        <button
                                          className="delete-item-btn"
                                          onClick={() => handleProductImageDelete(img.id)}
                                        >
                                          🗑️
                                        </button>
                                      </div>
                                      <img src={getImageUrl(img.image_url)} alt={img.description || 'Product image'} />
                                      {img.description && (
                                        <div className="product-img-description">{img.description}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="no-product-images">
                                <p>Chưa có ảnh mô tả. Nhấn 📷 để thêm ảnh.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="empty-message">Chưa có sản phẩm nào</p>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer với thông tin liên hệ */}
      <FooterComp contacts={contracts} />

      {/* Modals */}
      {editProfileModal && (
        <EditProfileModal
          profile={profile?.data || profile}
          onSave={handleUpdateProfile}
          onClose={() => setEditProfileModal(false)}
        />
      )}

      {editImageModal.open && (
        <EditImageModal
          image={editImageModal.image}
          mode={editImageModal.mode}
          onSave={handleImageSave}
          onClose={() => setEditImageModal({ open: false, image: null, mode: 'create' })}
        />
      )}

      {editEducationModal.open && (
        <EditEducationModal
          education={editEducationModal.education}
          mode={editEducationModal.mode}
          onSave={handleEducationSave}
          onClose={() => setEditEducationModal({ open: false, education: null, mode: 'create' })}
        />
      )}

      {editJobModal.open && (
        <EditJobModal
          job={editJobModal.job}
          mode={editJobModal.mode}
          onSave={handleJobSave}
          onClose={() => setEditJobModal({ open: false, job: null, mode: 'create' })}
        />
      )}

      {editLanguageModal.open && (
        <EditLanguageModal
          language={editLanguageModal.language}
          mode={editLanguageModal.mode}
          onSave={handleLanguageSave}
          onClose={() => setEditLanguageModal({ open: false, language: null, mode: 'create' })}
        />
      )}

      {editContractModal.open && (
        <EditContractModal
          contract={editContractModal.contract}
          mode={editContractModal.mode}
          onSave={handleContractSave}
          onClose={() => setEditContractModal({ open: false, contract: null, mode: 'create' })}
        />
      )}

      {editAchievementModal.open && (
        <EditAchievementModal
          achievement={editAchievementModal.achievement}
          mode={editAchievementModal.mode}
          onSave={handleAchievementSave}
          onClose={() => setEditAchievementModal({ open: false, achievement: null, mode: 'create' })}
        />
      )}

      {editProductModal.open && (
        <EditProductModal
          product={editProductModal.product}
          mode={editProductModal.mode}
          productImages={productImages}
          onSave={handleProductSave}
          onClose={() => setEditProductModal({ open: false, product: null, mode: 'create' })}
        />
      )}

      {editProductImageModal.open && (
        <EditProductImageModal
          productImage={editProductImageModal.productImage}
          productId={editProductImageModal.productId}
          products={products}
          mode={editProductImageModal.mode}
          onSave={handleProductImageSave}
          onClose={() => setEditProductImageModal({ open: false, productImage: null, productId: null, mode: 'create' })}
        />
      )}

      {editSkillModal.open && (
        <EditSkillModal
          skill={editSkillModal.skill}
          mode={editSkillModal.mode}
          onSave={handleSkillSave}
          onClose={() => setEditSkillModal({ open: false, skill: null, mode: 'create' })}
        />
      )}

      {editTargetModal.open && (
        <EditTargetModal
          target={editTargetModal.target}
          mode={editTargetModal.mode}
          onSave={handleTargetSave}
          onClose={() => setEditTargetModal({ open: false, target: null, mode: 'create' })}
        />
      )}
    </div>
  );
};

export default MyProfileComp;
