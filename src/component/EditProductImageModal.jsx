import React, { useState, useEffect } from 'react';
import { uploadProductImage as uploadProductImageAPI } from '../api/API';
import { getToken } from '../authen/authen';
import './Modal.css';

const EditProductImageModal = ({ productImage, productId, products, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    product_id: '',
    image_url: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (productImage && mode === 'edit') {
      setFormData({
        product_id: productImage.product_id || '',
        image_url: productImage.image_url || '',
        description: productImage.description || '',
      });
      setPreview(productImage.image_url || null);
    } else {
      setFormData({
        product_id: productId || '',
        image_url: '',
        description: '',
      });
      setPreview(null);
    }
    setSelectedFile(null);
  }, [productImage, productId, mode]);

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
        const uploadResult = await uploadProductImageAPI(selectedFile, token);
        finalFormData.image_url = uploadResult.image_url;
      } catch (error) {
        alert('Upload ảnh thất bại: ' + error.message);
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    
    if (!finalFormData.image_url) {
      alert('Vui lòng chọn ảnh');
      return;
    }
    
    if (!finalFormData.description) delete finalFormData.description;
    await onSave(finalFormData, productImage?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Chỉnh sửa' : 'Thêm'} Ảnh Sản Phẩm</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Sản phẩm *</label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              required
              disabled={mode === 'edit'}
            >
              <option value="">Chọn sản phẩm...</option>
              {products && products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.product_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Ảnh *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="image-file-input"
              id="product-image-file-input"
              style={{ display: 'none' }}
            />
            <label htmlFor="product-image-file-input" className="file-input-label">
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
                    setFormData({ ...formData, image_url: '' });
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Nhập mô tả ảnh"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-save" disabled={uploading}>
              {uploading ? 'Đang upload...' : (mode === 'edit' ? 'Cập nhật' : 'Thêm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductImageModal;

