import React, { useState, useEffect } from 'react';
import './Modal.css';

const EditSkillModal = ({ skill, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    skill_name: '',
    level: '',
  });

  useEffect(() => {
    if (skill && mode === 'edit') {
      setFormData({
        skill_name: skill.skill_name || '',
        level: skill.level || '',
      });
    } else {
      setFormData({
        skill_name: '',
        level: '',
      });
    }
  }, [skill, mode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, skill?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit' : 'Add'} Skill</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Skill Name *</label>
            <input
              type="text"
              name="skill_name"
              value={formData.skill_name}
              onChange={handleChange}
              required
              placeholder="E.g.: JavaScript, Python, React..."
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
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {mode === 'edit' ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSkillModal;

