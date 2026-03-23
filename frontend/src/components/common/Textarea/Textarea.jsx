import React from 'react';
import styles from './Textarea.module.css';

const Textarea = ({ label, placeholder, value, onChange, error, rows = 4 }) => {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea
        className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Textarea;
