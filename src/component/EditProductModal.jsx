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
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
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
    
    // Check if there are any images
    const hasImages = images.some(img => img.file || img.image_url);
    if (!hasImages) {
      alert('Please add at least 1 product image');
      return;
    }

    setUploading(true);
    try {
      const token = getToken();
      const uploadedImages = [];
      
      // Upload each image if there is a new file
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        
        if (img.file) {
          // Upload new file
          const uploadResult = await uploadProductImage(img.file, token);
          uploadedImages.push({
            image_url: uploadResult.image_url,
            description: img.description || '',
          });
        } else if (img.image_url) {
          // Keep existing image
          uploadedImages.push({
            image_url: img.image_url,
            description: img.description || '',
          });
        }
      }
      
      if (uploadedImages.length === 0) {
        alert('Please add at least 1 product image');
        setUploading(false);
        return;
      }

      // First image → product_image, remaining images → productImages (with description)
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
      alert('Image upload failed: ' + error.message);
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit' : 'Add'} Product</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="form-group">
            <label>Product URL</label>
            <input
              type="url"
              name="product_url"
              value={formData.product_url}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label>Product Images *</label>
            <div className="images-input-list">
              {images.map((image, index) => (
                <div key={index} className="image-input-item">
                  <div className="image-item-header">
                    <span className="image-item-label">
                      {index === 0 ? 'Main Image' : `Description Image ${index}`}
                    </span>
                    {index > 0 && (
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveImage(index)}
                        title="Remove this image"
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
                      {image.preview ? '📷 Change Image' : '📷 Select Image'}
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
                        placeholder="Description for this image (optional)"
                        rows="2"
                        className="image-description-input"
                      />
                    </div>
                  )}
                  {index === 0 && images.length > 1 && (
                    <small className="image-note">First image will be the main product image</small>
                  )}
                  {index > 0 && (
                    <small className="image-note">This image will be added to the description images list with its own description</small>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-image-input-btn"
                onClick={handleAddImage}
              >
                + Add Description Image
              </button>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={uploading}>
              {uploading ? 'Uploading...' : (mode === 'edit' ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;

