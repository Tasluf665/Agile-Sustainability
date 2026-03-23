import React from 'react';
import { Link } from 'react-router-dom';
import styles from './PublicFooter.module.css';

const PublicFooter = () => {
  return (
    <footer className={styles.pageFooter}>
      <div className={styles.footerLeft}>
        © 2024 GreenStory Sustainability Archive
      </div>
      <div className={styles.footerRight}>
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/contact">Contact Support</Link>
      </div>
    </footer>
  );
};

export default PublicFooter;
