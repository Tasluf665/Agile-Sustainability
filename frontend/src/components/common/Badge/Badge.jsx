import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ label, icon: Icon, color, variant }) => {
  // If a specific color is passed, use inline styles (legacy support)
  // Otherwise, use semantic variant classes (success, warning, info, primary)
  const isInline = !!color && !variant;
  const badgeClass = `${styles.badge} ${variant ? styles[variant] : ''}`;

  return (
    <div 
      className={badgeClass} 
      style={isInline ? { 
        backgroundColor: `${color}15`, 
        color: color,
        border: `1px solid ${color}30` 
      } : {}}
    >
      {Icon && <Icon size={12} className={styles.icon} />}
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default Badge;
