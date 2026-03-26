import React from 'react';
import AppShell from '../../components/layout/AppShell/AppShell';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <AppShell>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <PageHeader 
            title="Dashboard" 
            subtitle="Overview of your sustainability impact and project progress."
          />
        </div>
        <div className={styles.content}>
          <div className={styles.placeholderCard}>
            <div className={styles.placeholderIcon}>📊</div>
            <h2 className={styles.placeholderTitle}>Dashboard is coming soon</h2>
            <p className={styles.placeholderText}>
              This page is currently unavailable. Features will be added soon...
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;
