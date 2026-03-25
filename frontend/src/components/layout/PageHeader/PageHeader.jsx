import React from 'react';
import styles from './PageHeader.module.css';

const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <div className={styles.header}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};

export default PageHeader;
