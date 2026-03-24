import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', fullWidth = false, onClick, isLoading, type = 'button', className = '' }) => {
  const buttonClasses = `${styles.button} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''} ${isLoading ? styles.loading : ''} ${className}`;

  return (
    <button type={type} className={buttonClasses} onClick={onClick} disabled={isLoading}>
      {isLoading ? (
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
