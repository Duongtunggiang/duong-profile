import React, { useState, useEffect } from 'react';
import './Modal.css';

const EditAchievementModal = ({ achievement, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    achievement_name: '',
    description: '',
  });

  useEffect(() => {
    if (achievement && mode === 'edit') {
      setFormData({
        achievement_name: achievement.achievement_name || '',
        description: achievement.description || '',
      });
    } else {
      setFormData({
        achievement_name: '',
        description: '',
      });
    }
  }, [achievement, mode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (!dataToSave.description) delete dataToSave.description;
    onSave(dataToSave, achievement?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Chỉnh sửa' : 'Thêm'} Thành Tựu</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Tên thành tựu *</label>
            <input
              type="text"
              name="achievement_name"
              value={formData.achievement_name}
              onChange={handleChange}
              required
              placeholder="Nhập tên thành tựu"
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập mô tả thành tựu"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-save">
              {mode === 'edit' ? 'Cập nhật' : 'Thêm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAchievementModal;

