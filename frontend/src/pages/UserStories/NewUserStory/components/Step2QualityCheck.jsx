import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import INVESTCard from './INVESTCard';
import IssuesPanel from './IssuesPanel';
import styles from './Step2QualityCheck.module.css';

const Step2QualityCheck = ({ investResults, issues, onNext }) => {
  return (
    <div className={styles.step2Layout}>
      <div className={styles.investSection}>
        <div className={styles.investHeader}>
          <div className={styles.agentBadge}>
            <AlertCircle size={14} />
            AGENT 1 — QUALITY CHECKER
          </div>
          <div className={styles.scoreContainer}>
            <label className={styles.scoreLabel}>QUALITY SCORE</label>
            <div className={styles.scoreBarRoot}>
              <div className={styles.scoreFill} style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>

        <h2 className={styles.gridTitle}>INVEST Criteria</h2>

        <div className={styles.investGrid}>
          {investResults.map((result, idx) => (
            <INVESTCard 
              key={idx}
              title={result.title}
              status={result.status}
              description={result.description}
            />
          ))}
        </div>

        <button className={styles.restructureButton} onClick={onNext}>
          <Sparkles size={20} />
          Restructure with INVEST
        </button>
      </div>

      <IssuesPanel issues={issues} />
    </div>
  );
};

export default Step2QualityCheck;
