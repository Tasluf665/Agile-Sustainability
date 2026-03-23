import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import styles from './AlertBanner.module.css';

const AlertBanner = ({ type = 'info', title, message, className }) => {
  const getIcon = () => {
    switch (type) {
      case 'error': return <AlertCircle size={20} className={styles.iconError} />;
      case 'success': return <CheckCircle size={20} className={styles.iconSuccess} />;
      case 'warning': return <AlertTriangle size={20} className={styles.iconWarning} />;
      default: return <Info size={20} className={styles.iconInfo} />;
    }
  };

  return (
    <div className={`${styles.alertContainer} ${styles[type]} ${className || ''}`}>
      <div className={styles.iconWrapper}>
        {getIcon()}
      </div>
      <div className={styles.contentWrapper}>
        {title && <h4 className={styles.alertTitle}>{title}</h4>}
        <p className={styles.alertMessage}>{message}</p>
      </div>
    </div>
  );
};

export default AlertBanner;
