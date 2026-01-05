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
          <h2>{mode === 'edit' ? 'Chỉnh sửa' : 'Thêm'} Liên Hệ</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Thông tin liên hệ *</label>
            <input
              type="text"
              name="contract_name"
              value={formData.contract_name}
              onChange={handleChange}
              required
              placeholder="Ví dụ: example@gmail.com, 0123456789, zalo_id"
            />
          </div>

          <div className="form-group">
            <label>Loại liên hệ *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Chọn loại liên hệ...</option>
              <option value="email">Email</option>
              <option value="phone">Điện thoại</option>
              <option value="zalo">Zalo</option>
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

export default EditContractModal;

