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
          <h2>{mode === 'edit' ? 'Edit' : 'Add'} Language</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Language *</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
              placeholder="E.g.: English, Japanese..."
            />
          </div>

          <div className="form-group">
            <label>Proficiency Level *</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="">Select level...</option>
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Good">Good</option>
              <option value="Very Good">Very Good</option>
              <option value="Fluent">Fluent</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLanguageModal;

