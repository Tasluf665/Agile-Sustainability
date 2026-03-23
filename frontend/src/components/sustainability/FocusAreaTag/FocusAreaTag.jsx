import React from 'react';
import styles from './FocusAreaTag.module.css';

const FocusAreaTag = ({ label, icon: Icon, isSelected, onToggle }) => {
  return (
    <button 
      type="button"
      className={`${styles.tag} ${isSelected ? styles.selected : ''}`}
      onClick={onToggle}
    >
      {Icon && <Icon size={14} className={styles.icon} />}
      <span className={styles.label}>{label}</span>
    </button>
  );
};

export default FocusAreaTag;
