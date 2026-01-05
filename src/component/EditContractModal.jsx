import React, { useState, useEffect } from 'react';
import './Modal.css';

const EditContractModal = ({ contract, mode, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    contract_name: '',
    status: '',
  });

  useEffect(() => {
    if (contract && mode === 'edit') {
      setFormData({
        contract_name: contract.contract_name || '',
        status: contract.status || '',
      });
    } else {
      setFormData({
        contract_name: '',
        status: '',
      });
    }
  }, [contract, mode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, contract?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'edit' ? 'Edit' : 'Add'} Contact</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Contact Information *</label>
            <input
              type="text"
              name="contract_name"
              value={formData.contract_name}
              onChange={handleChange}
              required
              placeholder="E.g.: example@gmail.com, 0123456789, zalo_id"
            />
          </div>

          <div className="form-group">
            <label>Contact Type *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select contact type...</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="zalo">Zalo</option>
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

export default EditContractModal;
