import React, { useState, useEffect } from 'react';
import { uploadImage } from '../api/API';
import { getToken } from '../authen/authen';
import './Modal.css';

const EditProfileModal = ({ profile, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    avatar_url: '',
    cover_url: '',
    bio: '',
    location: '',
    hometown: '',
    marital_status: '',
    date_of_birth: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        nickname: profile.nickname || '',
        avatar_url: profile.avatar_url || '',
        cover_url: profile.cover_url || '',
        bio: profile.bio || '',
        location: profile.location || '',
        hometown: profile.hometown || '',
        marital_status: profile.marital_status || '',
        date_of_birth: profile.date_of_birth ? profile.date_of_birth.split('T')[0] : '',
      });
      setAvatarPreview(profile.avatar_url || null);
      setCoverPreview(profile.cover_url || null);
    }
    setAvatarFile(null);
    setCoverFile(null);
  }, [profile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const token = getToken();
      const dataToSave = { ...formData };
      
      // Upload avatar nếu có file mới
      if (avatarFile) {
        const uploadResult = await uploadImage(avatarFile, token);
        dataToSave.avatar_url = uploadResult.image_url;
      }
      
      // Upload cover nếu có file mới
      if (coverFile) {
        const uploadResult = await uploadImage(coverFile, token);
        dataToSave.cover_url = uploadResult.image_url;
      }
      
      if (!dataToSave.date_of_birth) delete dataToSave.date_of_birth;
      await onSave(dataToSave);
      setUploading(false);
    } catch (error) {
      alert('Upload ảnh thất bại: ' + error.message);
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chỉnh sửa Profile</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Nhập tên"
              />
            </div>
            <div className="form-group">
              <label>Họ</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Nhập họ"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Biệt danh</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="Nhập biệt danh"
            />
          </div>

          <div className="form-group">
            <label>Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="image-file-input"
              id="avatar-file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="avatar-file-input" className="file-input-label">
              {avatarPreview ? '📷 Đổi avatar' : '📷 Chọn avatar'}
            </label>
            {avatarPreview && (
              <div className="image-preview-small">
                <img src={avatarPreview} alt="Avatar preview" />
                <button
                  type="button"
                  className="remove-preview-btn"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                    setFormData({ ...formData, avatar_url: '' });
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Ảnh bìa</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverFileChange}
              className="image-file-input"
              id="cover-file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="cover-file-input" className="file-input-label">
              {coverPreview ? '📷 Đổi ảnh bìa' : '📷 Chọn ảnh bìa'}
            </label>
            {coverPreview && (
              <div className="image-preview-small">
                <img src={coverPreview} alt="Cover preview" />
                <button
                  type="button"
                  className="remove-preview-btn"
                  onClick={() => {
                    setCoverFile(null);
                    setCoverPreview(null);
                    setFormData({ ...formData, cover_url: '' });
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Tiểu sử</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Nhập tiểu sử"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Địa điểm</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Nhập địa điểm"
              />
            </div>
            <div className="form-group">
              <label>Quê quán</label>
              <input
                type="text"
                name="hometown"
                value={formData.hometown}
                onChange={handleChange}
                placeholder="Nhập quê quán"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tình trạng hôn nhân</label>
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
              >
                <option value="">Chọn...</option>
                <option value="Độc thân">Độc thân</option>
                <option value="Đã kết hôn">Đã kết hôn</option>
                <option value="Đã ly hôn">Đã ly hôn</option>
              </select>
            </div>
            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-save" disabled={uploading}>
              {uploading ? 'Đang upload...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;

