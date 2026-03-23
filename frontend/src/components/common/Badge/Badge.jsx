import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ label, icon: Icon, color }) => {
  return (
    <div 
      className={styles.badge} 
      style={{ 
        backgroundColor: `${color}15`, // 15% opacity
        color: color,
        border: `1px solid ${color}30` // 30% opacity
      }}
    >
      {Icon && <Icon size={12} className={styles.icon} />}
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default Badge;
