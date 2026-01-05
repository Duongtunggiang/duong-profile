import React, { useState, useEffect } from 'react';
import './Modal.css';

const EditLanguageModal = ({ language, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    language: '',
    level: '',
  });

  useEffect(() => {
    if (language && mode === 'edit') {
      setFormData({
        language: language.language || '',
        level: language.level || '',
      });
    } else {
      setFormData({
        language: '',
        level: '',
      });
    }
  }, [language, mode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, language?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Chỉnh sửa' : 'Thêm'} Ngôn Ngữ</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Ngôn ngữ *</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Tiếng Anh, Tiếng Nhật..."
            />
          </div>

          <div className="form-group">
            <label>Trình độ *</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="">Chọn trình độ...</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Khá">Khá</option>
              <option value="Tốt">Tốt</option>
              <option value="Thành thạo">Thành thạo</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-save">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLanguageModal;

