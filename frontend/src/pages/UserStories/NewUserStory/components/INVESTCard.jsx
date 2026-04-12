import React from 'react';
import styles from './Step2QualityCheck.module.css';

const INVESTCard = ({ title, status, description }) => {
  const isFail = status === 'FAIL';
  
  return (
    <div className={`${styles.investCard} ${isFail ? styles.investCardFail : ''}`}>
      <div className={styles.cardHeaderRow}>
        <span className={styles.cardTitle}>{title}</span>
        <span className={`${styles.statusTag} ${status === 'PASS' ? styles.statusTagPass : styles.statusTagFail}`}>
          {status}
        </span>
      </div>
      <p className={styles.cardDesc}>{description}</p>
    </div>
  );
};

export default INVESTCard;
