import React from 'react';
import AppShell from '../../components/layout/AppShell/AppShell';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import styles from './Settings.module.css';

const Settings = () => {
  return (
    <AppShell>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <PageHeader 
            title="Settings" 
            subtitle="Manage your account preferences and project configurations."
          />
        </div>
        <div className={styles.content}>
          <div className={styles.placeholderCard}>
            <div className={styles.placeholderIcon}>⚙️</div>
            <h2 className={styles.placeholderTitle}>Settings is coming soon</h2>
            <p className={styles.placeholderText}>
              This page is currently unavailable. Features will be added soon...
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Settings;
