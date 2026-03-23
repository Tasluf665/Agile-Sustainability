import React from 'react';
import { PlusCircle } from 'lucide-react';
import styles from './CreateProjectCard.module.css';

const CreateProjectCard = ({ onClick }) => {
  return (
    <button className={styles.card} onClick={onClick}>
      <div className={styles.iconContainer}>
        <PlusCircle size={48} strokeWidth={1.5} color="#94A3B8" />
      </div>
      <h3 className={styles.title}>Create New Project</h3>
      <p className={styles.subtitle}>Start a new sustainability initiative</p>
    </button>
  );
};

export default CreateProjectCard;
