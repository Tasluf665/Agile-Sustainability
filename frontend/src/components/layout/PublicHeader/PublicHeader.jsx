import React from 'react';
import { Link } from 'react-router-dom';
import leafIcon from '../../../assets/icons/leaf.svg';
import styles from './PublicHeader.module.css';

const PublicHeader = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLogoContainer}>
        <div className={styles.headerLogoCircle}>
          <img src={leafIcon} alt="GreenStory" className={styles.headerLogo} />
        </div>
        <span className={styles.headerTitle}>GreenStory</span>
      </div>
    </header>
  );
};

export default PublicHeader;
