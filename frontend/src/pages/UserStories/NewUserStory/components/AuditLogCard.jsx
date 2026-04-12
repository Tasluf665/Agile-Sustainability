import React from 'react';
import { Check, Clock } from 'lucide-react';
import styles from './Step3Structure.module.css';

const AuditLogCard = ({ confidence = 94, analysisId = '#GS-4491', changes = [] }) => {
  const displayChanges = changes.length > 0 ? changes.map(c => ({ text: c })) : [
    { text: 'Added a specific user role (registered viewer) instead of generic "user".' },
    { text: 'Defined "historical data" to specify last three projects.' },
    { text: 'Quantified performance requirements (2.5 seconds).' },
    { text: 'Added mandatory sustainability indicators.' }
  ];

  return (
    <div className={styles.auditLogCard}>
      <header className={styles.auditHeader}>
        <h3 className={styles.auditTitle}>What Agent 1 Changed</h3>
        <p className={styles.auditSubtitle}>AUDIT LOG</p>
      </header>

      <div className={styles.auditContent}>
        <div className={styles.changeList}>
          {displayChanges.map((item, index) => (
            <div key={index} className={styles.changeItem}>
              <div className={styles.checkIcon}>
                <Check size={12} strokeWidth={3} />
              </div>
              <p className={styles.changeText}>{item.text}</p>
            </div>
          ))}
        </div>

        <section className={styles.confidenceSection}>
          <div className={styles.confidenceBox}>
            <span className={styles.confidenceLabel}>AGENT CONFIDENCE</span>
            <div className={styles.confidenceBarRow}>
              <div className={styles.barBg}>
                <div 
                  className={styles.barFill} 
                  style={{ width: `${confidence}%` }}
                />
              </div>
              <span className={styles.confidenceValue}>{confidence}%</span>
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.auditFooter}>
        <span className={styles.analysisId}>ANALYSIS ID: {analysisId}</span>
        <Clock size={14} className={styles.historyIcon} />
      </footer>
    </div>
  );
};

export default AuditLogCard;
