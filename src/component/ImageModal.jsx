import React, { useEffect } from 'react';
import './ImageModal.css';

const ImageModal = ({ image, onClose }) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!image) return null;

  const imageUrl = image.images_url || image.image_url;
  const description = image.description || image.image_type || '';

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="image-modal-content">
          <div className="image-modal-image-wrapper">
            <img 
              src={imageUrl} 
              alt={description || 'Image'} 
              className="image-modal-image"
            />
          </div>
          {description && (
            <div className="image-modal-description">
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;

