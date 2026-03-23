import React from 'react';
import styles from './PasswordStrengthBar.module.css';

const PasswordStrengthBar = ({ password }) => {
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'transparent' };
    if (pwd.length < 6) return { score: 1, label: 'WEAK', color: '#ef4444' };
    if (pwd.length < 10) return { score: 2, label: 'FAIR', color: '#f59e0b' };
    
    // Check for mix of characters for STRONG
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);
    
    if (hasLetter && hasNumber && hasSymbol) {
      return { score: 3, label: 'STRONG', color: '#1c5f20' };
    }
    return { score: 2, label: 'FAIR', color: '#f59e0b' };
  };

  const { score, label, color } = getStrength(password);

  return (
    <div className={styles.container}>
      <div className={styles.barContainer}>
        <div className={styles.bar}>
          <div 
            className={styles.progress} 
            style={{ 
              width: `${(score / 3) * 100}%`,
              backgroundColor: color 
            }} 
          />
        </div>
        {label && <span className={styles.label} style={{ color }}>{label}</span>}
      </div>
      <p className={styles.hint}>
        Use 8 or more characters with a mix of letters, numbers & symbols.
      </p>
    </div>
  );
};

export default PasswordStrengthBar;
