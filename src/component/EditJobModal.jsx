import React, { useState, useEffect } from 'react';
import './Modal.css';

const EditJobModal = ({ job, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    job_name: '',
    company_name: '',
    start_date: '',
    end_date: '',
    description: '',
  });

  useEffect(() => {
    if (job && mode === 'edit') {
      setFormData({
        job_name: job.job_name || '',
        company_name: job.company_name || '',
        start_date: job.start_date ? job.start_date.split('T')[0] : '',
        end_date: job.end_date || '',
        description: job.description || '',
      });
    } else {
      setFormData({
        job_name: '',
        company_name: '',
        start_date: '',
        end_date: '',
        description: '',
      });
    }
  }, [job, mode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (!dataToSave.start_date) delete dataToSave.start_date;
    if (!dataToSave.end_date) delete dataToSave.end_date;
    if (!dataToSave.description) delete dataToSave.description;
    onSave(dataToSave, job?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit' : 'Add'} Job</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="job_name"
              value={formData.job_name}
              onChange={handleChange}
              required
              placeholder="E.g.: Software Engineer, Internship..."
            />
          </div>

          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              placeholder="Enter company name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="text"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                placeholder="YYYY-MM-DD or 'Present'"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter job description"
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

export default EditJobModal;

