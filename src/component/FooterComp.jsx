import React from 'react';
import './FooterComp.css';

const FooterComp = ({ contacts = [] }) => {
  const handleContactClick = (contact) => {
    const { contract_name, status } = contact;
    
    if (status === 'email') {
      // Mở Gmail với email
      window.location.href = `mailto:${contract_name}`;
    } else if (status === 'phone') {
      // Mở ứng dụng gọi điện
      window.location.href = `tel:${contract_name}`;
    } else if (status === 'zalo') {
      // Mở Zalo (có thể là link hoặc ID)
      // Nếu là số điện thoại, mở Zalo với số đó
      if (/^[0-9]+$/.test(contract_name)) {
        window.open(`https://zalo.me/${contract_name}`, '_blank');
      } else {
        // Nếu là username hoặc link
        window.open(`https://zalo.me/${contract_name}`, '_blank');
      }
    }
  };

  const getContactIcon = (status) => {
    switch (status) {
      case 'email':
        return '📧';
      case 'phone':
        return '📱';
      case 'zalo':
        return '💬';
      default:
        return '📞';
    }
  };

  const getContactLabel = (status) => {
    switch (status) {
      case 'email':
        return 'Email';
      case 'phone':
        return 'Điện thoại';
      case 'zalo':
        return 'Zalo';
      default:
        return 'Liên hệ';
    }
  };

  if (!contacts || contacts.length === 0) {
    return null;
  }

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <h3 className="footer-title">Liên Hệ</h3>
        <div className="contacts-list">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="contact-item"
              onClick={() => handleContactClick(contact)}
              title={`Click để ${getContactLabel(contact.status)}`}
            >
              <span className="contact-icon">{getContactIcon(contact.status)}</span>
              <span className="contact-label">{getContactLabel(contact.status)}:</span>
              <span className="contact-value">{contact.contract_name}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterComp;
