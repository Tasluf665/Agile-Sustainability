import React from 'react';

import styles from './InfoBox.module.css';

const InfoBox = ({ icon: Icon, title, description }) => {
  return (
    <div className={styles.infoBoxContainer}>
      {Icon && (
        <div className={styles.iconWrapper}>
          <Icon size={20} className={styles.icon} />
        </div>
      )}
      <div className={styles.textContainer}>
        <h4 className={styles.title}>{title}</h4>
        <div className={styles.description}>
          {typeof description === 'string' ? (
            <p>{description}</p>
          ) : (
            description
          )}
        </div>
      </div>
    </div>
  );
};



export default InfoBox;
