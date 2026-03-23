import React from 'react';
import styles from './SkeletonCard.module.css';

const SkeletonCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.banner} />
      <div className={styles.content}>
        <div className={styles.badge} />
        <div className={styles.title} />
        <div className={styles.description} />
        <div className={styles.stats}>
          <div className={styles.stat} />
          <div className={styles.stat} />
        </div>
        <div className={styles.button} />
      </div>
    </div>
  );
};

export default SkeletonCard;
