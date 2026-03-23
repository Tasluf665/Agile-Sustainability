import React from 'react';

import styles from './UsageIndicator.module.css';

const UsageIndicator = ({ count, unit, period }) => {
  return (
    <div className={styles.usageContainer}>
      <div className={styles.avatarStack}>
        <div className={`${styles.avatar} ${styles.avatar1}`}></div>
        <div className={`${styles.avatar} ${styles.avatar2}`}></div>
      </div>
      <div className={styles.textContainer}>
        Used by {count} {unit} this {period}
      </div>
    </div>
  );
};



UsageIndicator.defaultProps = {
  unit: 'teammates',
  period: 'week'
};

export default UsageIndicator;
