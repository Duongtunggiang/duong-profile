import React, { useState, useEffect } from 'react';
import { getPublicProfileAll, getImageUrl } from '../api/API';
import HeaderComp from './HeaderComp';
import FooterComp from './FooterComp';
import ImageModal from './ImageModal';
import './ProfileComp.css';

const ProfileComp = () => {
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
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadPublicData();
  }, []);

  const loadPublicData = async () => {
    try {
      // Không block UI, hiển thị skeleton ngay
      setLoading(true);
      const data = await getPublicProfileAll();
      
      // Load và hiển thị dữ liệu từng phần
      if (data && data.status === 'success') {
        const profileData = data.profile?.data || data.profile || null;
        
        // Set profile trước để hiển thị header
        if (profileData) {
          setProfile(profileData);
        }
        
        // Load các phần còn lại và hiển thị dần
        setTimeout(() => {
          setImages(data.images?.data || data.images || []);
        }, 100);
        
        setTimeout(() => {
          setEducations(data.educations?.data || data.educations || []);
        }, 150);
        
        setTimeout(() => {
          const jobsData = data.jobs?.data || data.jobs || [];
          // Sắp xếp jobs theo start_date giảm dần (mới nhất trước)
          const sortedJobs = [...jobsData].sort((a, b) => {
            if (!a.start_date && !b.start_date) return 0;
            if (!a.start_date) return 1; // Không có start_date xếp cuối
            if (!b.start_date) return -1;
            return new Date(b.start_date) - new Date(a.start_date);
          });
          setJobs(sortedJobs);
        }, 200);
        
        setTimeout(() => {
          setLanguages(data.languages?.data || data.languages || []);
          setSkills(data.skills?.data || data.skills || []);
        }, 250);
        
        setTimeout(() => {
          setContracts(data.contracts?.data || data.contracts || []);
        }, 300);
        
        setTimeout(() => {
          setAchievements(data.achievements?.data || data.achievements || []);
        }, 350);
        
        setTimeout(() => {
          setProducts(data.products?.data || data.products || []);
          setProductImages(data.product_images?.data || data.product_images || []);
        }, 400);
        
        setTimeout(() => {
          setTargets(data.targets?.data || data.targets || []);
          setLoading(false);
        }, 450);
      } else {
        // Nếu không có dữ liệu, reset tất cả
        setProfile(null);
        setImages([]);
        setEducations([]);
        setJobs([]);
        setLanguages([]);
        setContracts([]);
        setAchievements([]);
        setProducts([]);
        setProductImages([]);
        setSkills([]);
        setTargets([]);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading public data:', error);
      // Nếu có lỗi, reset tất cả state nhưng vẫn hiển thị UI
      setProfile(null);
      setImages([]);
      setEducations([]);
      setJobs([]);
      setLanguages([]);
      setContracts([]);
      setAchievements([]);
      setProducts([]);
      setProductImages([]);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Skeleton component cho profile header
  const ProfileHeaderSkeleton = () => (
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
        <div className="profile-meta">
          <div className="meta-item skeleton-pulse"></div>
          <div className="meta-item skeleton-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Luôn hiển thị UI, không block với loading spinner
  return (
    <div className="profile-wrapper">
      <HeaderComp />
      <div className="profile-container">

      {/* Cover Image */}
      <div className="cover-section">
        {loading && !profile ? (
          <div className="cover-placeholder skeleton-pulse">
            <div className="skeleton-shimmer"></div>
          </div>
        ) : profile?.cover_url ? (
          <img src={getImageUrl(profile.cover_url)} alt="Cover" className="cover-image fade-in" />
        ) : (
          <div className="cover-placeholder"></div>
        )}
      </div>

      {/* Profile Header */}
      {loading && !profile ? (
        <ProfileHeaderSkeleton />
      ) : profile ? (
        <div className="profile-header fade-in">
          <div className="avatar-section">
            {profile.avatar_url ? (
              <img src={getImageUrl(profile.avatar_url)} alt="Avatar" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                {profile.first_name?.[0] || profile.nickname?.[0] || 'U'}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">
              {profile.first_name || profile.last_name
                ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
                : profile.nickname || 'No name'}
            </h1>
            {profile.nickname && (
              <p className="profile-nickname">@{profile.nickname}</p>
            )}
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            <div className="profile-meta">
              {profile.location && (
                <span className="meta-item">
                  <span className="meta-icon">📍</span> {profile.location}
                </span>
              )}
              {profile.hometown && (
                <span className="meta-item">
                  <span className="meta-icon">🏠</span> {profile.hometown}
                </span>
              )}
              {profile.date_of_birth && (
                <span className="meta-item">
                  <span className="meta-icon">🎂</span> {formatDate(profile.date_of_birth)}
                </span>
              )}
              {profile.marital_status && (
                <span className="meta-item">
                  <span className="meta-icon">💍</span> {profile.marital_status}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="profile-header">
          <div className="empty-profile">
            <h2>No profile information</h2>
            <p>Please log in to create your profile.</p>
          </div>
        </div>
      )}

      {/* Target Section - Full width, between profile header and main content */}
      {loading && targets.length === 0 ? (
        <div className="target-section">
          <section className="profile-section">
            <h2 className="section-title">Career Goals</h2>
            <div className="target-content">
              <div className="target-item skeleton-pulse">
                <div className="skeleton-line skeleton-text-line"></div>
                <div className="skeleton-line skeleton-text-line"></div>
              </div>
            </div>
          </section>
        </div>
      ) : targets && targets.length > 0 ? (
        <div className="target-section fade-in">
          <section className="profile-section">
            <h2 className="section-title">Career Goals</h2>
            <div className="target-content">
              {targets.map((target) => (
                <p key={target.id} className="target-text">{target.target}</p>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {/* Main Content - Grid Layout */}
      <div className="profile-content">
        {/* Sidebar - Left Column */}
        <div className="profile-sidebar">
          {/* Skills Section - Above Languages */}
          {loading && skills.length === 0 ? (
            <section className="profile-section">
              <h2 className="section-title">Skills</h2>
              <div className="skills-grid">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skill-item skeleton-pulse">
                    <div className="skeleton-line"></div>
                  </div>
                ))}
              </div>
            </section>
          ) : skills && skills.length > 0 ? (
            <section className="profile-section fade-in">
              <h2 className="section-title">Skills</h2>
              <div className="skills-grid">
                {skills.map((skill) => (
                  <div key={skill.id} className="skill-item">
                    <span className="skill-name">{skill.skill_name}</span>
                    <span className="skill-level">{skill.level}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Languages Section */}
          {loading && languages.length === 0 ? (
            <section className="profile-section">
              <h2 className="section-title">Languages</h2>
              <div className="skills-grid">
                {[1, 2].map((i) => (
                  <div key={i} className="skill-item skeleton-pulse">
                    <div className="skeleton-line"></div>
                  </div>
                ))}
              </div>
            </section>
          ) : languages && languages.length > 0 ? (
            <section className="profile-section fade-in">
              <h2 className="section-title">Languages</h2>
              <div className="skills-grid">
                {languages.map((lang) => (
                  <div key={lang.id} className="skill-item">
                    <span className="skill-name">{lang.language}</span>
                    <span className="skill-level">{lang.level}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Images Section */}
          {loading && images.length === 0 ? (
            <section className="profile-section">
              <h2 className="section-title">Images</h2>
              <div className="images-grid-sidebar">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="image-item skeleton-pulse">
                    <div className="skeleton-shimmer"></div>
                  </div>
                ))}
              </div>
            </section>
          ) : images && images.length > 0 ? (
            <section className="profile-section fade-in">
              <h2 className="section-title">Images</h2>
              <div className="images-grid-sidebar">
                {images.slice(0, 4).map((image) => (
                  <div 
                    key={image.id} 
                    className="image-item clickable-image"
                    onClick={() => setSelectedImage({
                      images_url: getImageUrl(image.images_url),
                      description: image.description || image.image_type || '',
                      image_type: image.image_type || ''
                    })}
                  >
                    <img src={getImageUrl(image.images_url)} alt={image.image_type} title={image.image_type}/>
                  </div>
                ))}
              </div>
              {images.length > 4 && (
                <p className="view-more">+{images.length - 4} more images</p>
              )}
            </section>
          ) : null}
        </div>

        {/* Main Content - Right Column */}
        <div className="profile-main">
          {/* Education Section */}
          {loading && educations.length === 0 ? (
            <section className="profile-section">
              <h2 className="section-title">Education</h2>
              <div className="timeline">
                {[1, 2].map((i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-content skeleton-pulse">
                      <div className="skeleton-line skeleton-title"></div>
                      <div className="skeleton-line skeleton-date"></div>
                      <div className="skeleton-line skeleton-text"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : educations && educations.length > 0 ? (
            <section className="profile-section fade-in">
              <h2 className="section-title">Education</h2>
              <div className="timeline">
                {educations.map((edu) => (
                  <div key={edu.id} className="timeline-item">
                    <div className="timeline-content">
                      <h3 className="timeline-title">{edu.school_name}</h3>
                      <div className="timeline-date">
                        {edu.start_year && formatDate(edu.start_year)}
                        {edu.start_year && edu.end_year && ' - '}
                        {edu.end_year && formatDate(edu.end_year)}
                      </div>
                      {edu.description && <p className="timeline-description">{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Jobs Section */}
          {loading && jobs.length === 0 ? (
            <section className="profile-section">
              <h2 className="section-title">Work Experience</h2>
              <div className="timeline">
                {[1, 2].map((i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-content skeleton-pulse">
                      <div className="skeleton-line skeleton-title"></div>
                      <div className="skeleton-line skeleton-date"></div>
                      <div className="skeleton-line skeleton-text"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : jobs && jobs.length > 0 ? (
            <section className="profile-section fade-in">
              <h2 className="section-title">Work Experience</h2>
              <div className="timeline">
                {jobs.map((job) => (
                  <div key={job.id} className="timeline-item-wrapper">
                    <div className="timeline-dot"></div>
                    <div className="timeline-item">
                    <div className="timeline-content">
                      <h3 className="timeline-title">
                        {job.job_name ? `${job.job_name} - ${job.company_name}` : job.company_name}
                      </h3>
                      <div className="timeline-date">
                        {job.start_date && formatDate(job.start_date)}
                        {job.start_date && job.end_date && ' - '}
                          {job.end_date || 'Present'}
                        </div>
                        {job.description && <p className="timeline-description">{job.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Achievements Section */}
          {loading && achievements.length === 0 ? (
            <section className="profile-section">
              <h2 className="section-title">Achievements</h2>
              <div className="achievements-list">
                {[1, 2].map((i) => (
                  <div key={i} className="achievement-item skeleton-pulse">
                    <div className="skeleton-line skeleton-title"></div>
                    <div className="skeleton-line skeleton-text"></div>
                  </div>
                ))}
              </div>
            </section>
          ) : achievements && achievements.length > 0 ? (
            <section className="profile-section fade-in">
              <h2 className="section-title">Achievements</h2>
              <div className="achievements-list">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="achievement-item">
                    <h3 className="achievement-name">{achievement.achievement_name}</h3>
                    {achievement.description && (
                      <p className="achievement-description">{achievement.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Products Section */}
          {loading && products.length === 0 ? (
            <section className="profile-section">
              <h2 className="section-title">Products</h2>
              <div className="products-grid">
                {[1, 2].map((i) => (
                  <div key={i} className="product-card skeleton-pulse">
                    <div className="product-image">
                      <div className="skeleton-shimmer"></div>
                    </div>
                    <div className="product-info">
                      <div className="skeleton-line skeleton-title"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : products && products.length > 0 ? (
            <section className="profile-section fade-in">
              <h2 className="section-title">Products</h2>
              <div className="products-grid">
                {products.map((product) => {
                  const productImgs = productImages.filter(img => img.product_id === product.id);
                  return (
                    <div key={product.id} className="product-card">
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
                        {productImgs.length > 0 && (
                          <div className="product-images-section">
                            <div className="product-images-header">
                              <span className="product-images-count">Description Images ({productImgs.length})</span>
                            </div>
                            <div className="product-images-grid">
                                {productImgs.map((img) => (
                                  <div 
                                    key={img.id} 
                                    className="product-img-item clickable-image"
                                    onClick={() => setSelectedImage({
                                      images_url: getImageUrl(img.image_url),
                                      description: img.description || 'Product description image',
                                      image_type: 'Ảnh mô tả'
                                    })}
                                  >
                                    <img src={getImageUrl(img.image_url)} alt={img.description || 'Product image'} title={img.description}/>
                                  {img.description && (
                                    <div className="product-img-description">{img.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </div>
      </div>
      {/* Footer với thông tin liên hệ */}
      <FooterComp contacts={contracts} />
      
      {/* Image Modal */}
      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

export default ProfileComp;
