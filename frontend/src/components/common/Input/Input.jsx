import React from 'react';
import styles from './Input.module.css';

const Input = ({ label, type = 'text', placeholder, value, onChange, error, rightElement, suffix, prefixIcon }) => {
  return (
    <div className={styles.container}>
      {label && (
        <div className={styles.labelContainer}>
          <label className={styles.label}>{label}</label>
          {rightElement && <div className={styles.rightElement}>{rightElement}</div>}
        </div>
      )}
      <div className={styles.inputWrapper}>
        {prefixIcon && <div className={styles.prefixIcon}>{prefixIcon}</div>}
        <input
          type={type}
          className={`${styles.input} ${error ? styles.inputError : ''} ${suffix ? styles.hasSuffix : ''} ${prefixIcon ? styles.hasPrefix : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {suffix && <div className={styles.suffix}>{suffix}</div>}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Input;
