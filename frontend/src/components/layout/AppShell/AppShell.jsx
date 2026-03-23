import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../Sidebar/Sidebar';
import styles from './AppShell.module.css';

const AppShell = ({ children }) => {
  const { projects } = useSelector((state) => state.projects);

  return (
    <div className={styles.shell}>
      <Sidebar projects={projects} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default AppShell;
