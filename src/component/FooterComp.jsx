import React from 'react';
import './FooterComp.css';

const FooterComp = ({ contacts = [] }) => {
  const getContactUrl = (contact) => {
    const { contract_name, status } = contact;
    
    if (status === 'email') {
      return `mailto:${contract_name}`;
    } else if (status === 'phone') {
      return `tel:${contract_name}`;
    } else if (status === 'zalo') {
      // Nếu là số điện thoại hoặc username, mở Zalo
      if (/^[0-9]+$/.test(contract_name)) {
        return `https://zalo.me/${contract_name}`;
      } else {
        return `https://zalo.me/${contract_name}`;
      }
    } else if (status === 'facebook') {
      // Nếu đã có https:// thì dùng trực tiếp, không thì thêm facebook.com
      if (contract_name.startsWith('http://') || contract_name.startsWith('https://')) {
        return contract_name;
      } else if (contract_name.startsWith('facebook.com/') || contract_name.startsWith('www.facebook.com/')) {
        return `https://${contract_name}`;
      } else {
        return `https://facebook.com/${contract_name}`;
      }
    } else if (status === 'instagram') {
      if (contract_name.startsWith('http://') || contract_name.startsWith('https://')) {
        return contract_name;
      } else if (contract_name.startsWith('instagram.com/') || contract_name.startsWith('www.instagram.com/')) {
        return `https://${contract_name}`;
      } else {
        return `https://instagram.com/${contract_name}`;
      }
    } else if (status === 'github') {
      if (contract_name.startsWith('http://') || contract_name.startsWith('https://')) {
        return contract_name;
      } else if (contract_name.startsWith('github.com/') || contract_name.startsWith('www.github.com/')) {
        return `https://${contract_name}`;
      } else {
        return `https://github.com/${contract_name}`;
      }
    } else if (status === 'link') {
      // Nếu không có http/https, thêm https://
      if (contract_name.startsWith('http://') || contract_name.startsWith('https://')) {
        return contract_name;
      } else {
        return `https://${contract_name}`;
      }
    }
    return '#';
  };

  const getContactIcon = (status) => {
    switch (status) {
      case 'email':
        return '📧';
      case 'phone':
        return '📱';
      case 'zalo':
        return '💬';
      case 'facebook':
        return '📘';
      case 'instagram':
        return '📷';
      case 'github':
        return '💻';
      case 'link':
        return '🔗';
      default:
        return '📞';
    }
  };

  const getContactLabel = (status) => {
    switch (status) {
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      case 'zalo':
        return 'Zalo';
      case 'facebook':
        return 'Facebook';
      case 'instagram':
        return 'Instagram';
      case 'github':
        return 'GitHub';
      case 'link':
        return 'Link';
      default:
        return 'Contact';
    }
  };

  if (!contacts || contacts.length === 0) {
    return null;
  }

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <h3 className="footer-title">Contact</h3>
        <div className="contacts-list">
          {contacts.map((contact) => {
            const url = getContactUrl(contact);
            const isLink = ['facebook', 'instagram', 'github', 'link'].includes(contact.status);
            
            if (isLink) {
              return (
                <a
                  key={contact.id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-item"
                  title={`Click to open ${getContactLabel(contact.status)}`}
                >
                  <span className="contact-icon">{getContactIcon(contact.status)}</span>
                  <span className="contact-label">{getContactLabel(contact.status)}:</span>
                  <span className="contact-value">{contact.contract_name}</span>
                </a>
              );
            } else {
              return (
                <div
                  key={contact.id}
                  className="contact-item"
                  onClick={() => window.location.href = url}
                  title={`Click to ${getContactLabel(contact.status)}`}
                >
                  <span className="contact-icon">{getContactIcon(contact.status)}</span>
                  <span className="contact-label">{getContactLabel(contact.status)}:</span>
                  <span className="contact-value">{contact.contract_name}</span>
                </div>
              );
            }
          })}
        </div>
      </div>
    </footer>
  );
};

export default FooterComp;
