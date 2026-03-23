import React from 'react';
import styles from './StepDots.module.css';

const StepDots = ({ total, current }) => {
  return (
    <div className={styles.container}>
      {[...Array(total)].map((_, index) => (
        <div 
          key={index} 
          className={`${styles.dot} ${index + 1 === current ? styles.active : ''}`} 
        />
      ))}
    </div>
  );
};

export default StepDots;
