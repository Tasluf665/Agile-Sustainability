import React from 'react';
import { Search, X } from 'lucide-react';
import styles from './SearchInput.module.css';

const SearchInput = ({ value, onChange, onClear, placeholder = 'Search...' }) => {
  return (
    <div className={styles.container}>
      <Search className={styles.icon} size={14} />
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      {value && onClear && (
        <button type="button" className={styles.clearButton} onClick={onClear}>
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
