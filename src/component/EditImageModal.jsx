import React, { useState, useEffect } from 'react';
import { uploadImage } from '../api/API';
import { getToken } from '../authen/authen';
import './Modal.css';

const EditImageModal = ({ image, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    images_url: '',
    image_type: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (image && mode === 'edit') {
      setFormData({
        images_url: image.images_url || '',
        image_type: image.image_type || '',
      });
      setPreview(image.images_url || null);
    } else {
      setFormData({
        images_url: '',
        image_type: '',
      });
      setPreview(null);
    }
    setSelectedFile(null);
  }, [image, mode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalFormData = { ...formData };
    
    // Nếu có file mới, upload trước
    if (selectedFile) {
      setUploading(true);
      try {
        const token = getToken();
        const uploadResult = await uploadImage(selectedFile, token);
        finalFormData.images_url = uploadResult.image_url;
      } catch (error) {
        alert('Upload ảnh thất bại: ' + error.message);
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    
    if (!finalFormData.images_url) {
      alert('Vui lòng chọn ảnh');
      return;
    }
    
    onSave(finalFormData, image?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Chỉnh sửa' : 'Thêm'} Hình Ảnh</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Hình ảnh *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="image-file-input"
              id="image-file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="image-file-input" className="file-input-label">
              {preview ? '📷 Đổi ảnh' : '📷 Chọn ảnh'}
            </label>
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
                <button
                  type="button"
                  className="remove-preview-btn"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setFormData({ ...formData, images_url: '' });
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Loại hình ảnh</label>
            <input
              type="text"
              name="image_type"
              value={formData.image_type}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Ảnh cá nhân, Ảnh công việc..."
            />
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

export default EditImageModal;

