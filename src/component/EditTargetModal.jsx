import React, { useState, useEffect } from 'react';
import './Modal.css';

const EditTargetModal = ({ target, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    target: '',
  });

  useEffect(() => {
    if (target && mode === 'edit') {
      setFormData({
        target: target.target || '',
      });
    } else {
      setFormData({
        target: '',
      });
    }
  }, [target, mode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, target?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Chỉnh sửa' : 'Thêm'} Mục Tiêu Nghề Nghiệp</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Mục tiêu nghề nghiệp *</label>
            <textarea
              name="target"
              value={formData.target}
              onChange={handleChange}
              required
              placeholder="Nhập mục tiêu nghề nghiệp của bạn..."
              rows="5"
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

export default EditTargetModal;

