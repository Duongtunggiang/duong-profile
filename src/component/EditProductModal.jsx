import React, { useState, useEffect } from 'react';
import { uploadProductImage } from '../api/API';
import { getToken } from '../authen/authen';
import './Modal.css';

const EditProductModal = ({ product, mode, onSave, onClose, productImages = [] }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    product_url: '',
    product_image: '',
  });
  const [images, setImages] = useState([{ image_url: '', description: '', file: null, preview: null }]); // Array of {image_url, description, file, preview}
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        product_name: product.product_name || '',
        product_url: product.product_url || '',
        product_image: product.product_image || '',
      });
      // Load existing product images với description
      const existingImages = productImages
        .filter(img => img.product_id === product.id)
        .map(img => ({
          image_url: img.image_url || '',
          description: img.description || '',
        }));
      // Combine với product_image nếu có (ảnh đầu tiên)
      if (product.product_image) {
        setImages([
          { image_url: product.product_image, description: '', file: null, preview: product.product_image },
          ...existingImages.map(img => ({ ...img, file: null, preview: img.image_url }))
        ]);
      } else {
        setImages(existingImages.length > 0 
          ? existingImages.map(img => ({ ...img, file: null, preview: img.image_url }))
          : [{ image_url: '', description: '', file: null, preview: null }]);
      }
    } else {
      setFormData({
        product_name: '',
        product_url: '',
        product_image: '',
      });
      setImages([{ image_url: '', description: '', file: null, preview: null }]);
    }
  }, [product, mode, productImages]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageFileChange = async (index, file) => {
    if (!file) return;
    
    // Kiểm tra file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }
    
    // Tạo preview
    const preview = URL.createObjectURL(file);
    const newImages = [...images];
    newImages[index] = { 
      ...newImages[index], 
      file: file,
      preview: preview 
    };
    setImages(newImages);
  };

  const handleImageDescriptionChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], description: value };
    setImages(newImages);
  };

  const handleAddImage = () => {
    setImages([...images, { image_url: '', description: '', file: null, preview: null }]);
  };

  const handleRemoveImage = (index) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra có ảnh nào không
    const hasImages = images.some(img => img.file || img.image_url);
    if (!hasImages) {
      alert('Vui lòng thêm ít nhất 1 ảnh cho sản phẩm');
      return;
    }

    setUploading(true);
    try {
      const token = getToken();
      const uploadedImages = [];
      
      // Upload từng ảnh nếu có file mới
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        
        if (img.file) {
          // Upload file mới
          const uploadResult = await uploadProductImage(img.file, token);
          uploadedImages.push({
            image_url: uploadResult.image_url,
            description: img.description || '',
          });
        } else if (img.image_url) {
          // Giữ nguyên ảnh cũ
          uploadedImages.push({
            image_url: img.image_url,
            description: img.description || '',
          });
        }
      }
      
      if (uploadedImages.length === 0) {
        alert('Vui lòng thêm ít nhất 1 ảnh cho sản phẩm');
        setUploading(false);
        return;
      }

      // Ảnh đầu tiên → product_image, các ảnh còn lại → productImages (với description)
      const productData = {
        ...formData,
        product_image: uploadedImages[0]?.image_url || '',
        product_images: uploadedImages.slice(1).map(img => ({
          image_url: img.image_url,
          description: img.description || '',
        })),
      };
      
      if (!productData.product_url) delete productData.product_url;
      await onSave(productData, product?.id);
    } catch (error) {
      alert('Upload ảnh thất bại: ' + error.message);
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Chỉnh sửa' : 'Thêm'} Sản Phẩm</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Tên sản phẩm *</label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div className="form-group">
            <label>URL sản phẩm</label>
            <input
              type="url"
              name="product_url"
              value={formData.product_url}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label>Ảnh sản phẩm *</label>
            <div className="images-input-list">
              {images.map((image, index) => (
                <div key={index} className="image-input-item">
                  <div className="image-item-header">
                    <span className="image-item-label">
                      {index === 0 ? 'Ảnh chính' : `Ảnh mô tả ${index}`}
                    </span>
                    {index > 0 && (
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveImage(index)}
                        title="Xóa ảnh này"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <div className="image-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleImageFileChange(index, file);
                      }}
                      className="image-file-input"
                      id={`image-file-${index}`}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor={`image-file-${index}`} className="file-input-label">
                      {image.preview ? '📷 Đổi ảnh' : '📷 Chọn ảnh'}
                    </label>
                    {image.preview && (
                      <div className="image-preview">
                        <img src={image.preview} alt="Preview" />
                        <button
                          type="button"
                          className="remove-preview-btn"
                          onClick={() => {
                            const newImages = [...images];
                            newImages[index] = { image_url: '', description: '', file: null, preview: null };
                            setImages(newImages);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  {index > 0 && (
                    <div className="image-description-wrapper">
                      <textarea
                        value={image.description}
                        onChange={(e) => handleImageDescriptionChange(index, e.target.value)}
                        placeholder="Mô tả cho ảnh này (tùy chọn)"
                        rows="2"
                        className="image-description-input"
                      />
                    </div>
                  )}
                  {index === 0 && images.length > 1 && (
                    <small className="image-note">Ảnh đầu tiên sẽ là ảnh chính của sản phẩm</small>
                  )}
                  {index > 0 && (
                    <small className="image-note">Ảnh này sẽ được thêm vào danh sách ảnh mô tả với mô tả riêng</small>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-image-input-btn"
                onClick={handleAddImage}
              >
                + Thêm ảnh mô tả
              </button>
            </div>
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

export default EditProductModal;

