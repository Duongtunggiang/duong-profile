import React, { useState, useEffect } from 'react';
import './Modal.css';

const EditEducationModal = ({ education, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    school_name: '',
    start_year: '',
    end_year: '',
    description: '',
  });

  useEffect(() => {
    if (education && mode === 'edit') {
      setFormData({
        school_name: education.school_name || '',
        start_year: education.start_year ? education.start_year.split('T')[0] : '',
        end_year: education.end_year ? education.end_year.split('T')[0] : '',
        description: education.description || '',
      });
    } else {
      setFormData({
        school_name: '',
        start_year: '',
        end_year: '',
        description: '',
      });
    }
  }, [education, mode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (!dataToSave.start_year) delete dataToSave.start_year;
    if (!dataToSave.end_year) delete dataToSave.end_year;
    if (!dataToSave.description) delete dataToSave.description;
    onSave(dataToSave, education?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit' : 'Add'} Education</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>School Name *</label>
            <input
              type="text"
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              required
              placeholder="Enter school name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Year</label>
              <input
                type="date"
                name="start_year"
                value={formData.start_year}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>End Year</label>
              <input
                type="date"
                name="end_year"
                value={formData.end_year}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows="4"
            />
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

export default EditEducationModal;

