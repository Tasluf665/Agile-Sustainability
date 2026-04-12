import React from 'react';
import { Leaf, Sparkles, Clock } from 'lucide-react';
import styles from './StatusFooter.module.css';

const StatusFooter = ({ lastSaved }) => {
  return (
    <footer className={styles.cardFooter}>
      <div className={styles.footerLeft}>
        <div className={styles.footerItem}>
          <Leaf size={14} />
          Eco-mode Active
        </div>
        <div className={styles.footerItem}>
          <Sparkles size={14} />
          AI Assisted
        </div>
      </div>
      <div className={styles.footerRight}>
        <div className={styles.footerItem}>
          <Clock size={14} />
          {lastSaved || 'Draft Saved 2m ago'}
        </div>
      </div>
    </footer>
  );
};

export default StatusFooter;
