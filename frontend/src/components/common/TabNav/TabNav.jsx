import React from 'react';
import styles from './TabNav.module.css';

const TabNav = ({ tabs, activeTab, onChange }) => {
  return (
    <div className={styles.tabNavContainer}>
      <div className={styles.tabList}>
        {tabs.map(tab => (
          <button
            key={tab.value}
            className={`${styles.tab} ${activeTab === tab.value ? styles.active : ''}`}
            onClick={() => onChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNav;
