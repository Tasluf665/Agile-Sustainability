import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import INVESTCard from './INVESTCard';
import IssuesPanel from './IssuesPanel';
import styles from './Step2QualityCheck.module.css';

const Step2QualityCheck = ({ originalStory, investResults, issues, qualityScore, onNext, isGenerating }) => {
  return (
    <div className={styles.step2Layout}>
      <div className={styles.investSection}>
        {/* Original Story Context */}
        <div className={styles.originalStoryCard}>
          <div className={styles.cardHeaderRow}>
            <span className={styles.cardHeaderLabel}>ORIGINAL DRAFT</span>
          </div>
          <p className={styles.originalText}>"{originalStory}"</p>
        </div>

        <div className={styles.investHeader}>
          <div className={styles.agentBadge}>
            <AlertCircle size={14} />
            AGENT 1 — QUALITY CHECKER
          </div>
          <div className={styles.scoreContainer}>
            <label className={styles.scoreLabel}>QUALITY SCORE</label>
            <div className={styles.scoreBarRoot}>
              <div className={styles.scoreFill} style={{ width: `${qualityScore}%` }}></div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#1c5f20', marginLeft: '8px' }}>
              {qualityScore}%
            </span>
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

        <button 
          className={styles.restructureButton} 
          onClick={onNext}
          disabled={isGenerating}
        >
          <Sparkles size={20} />
          {isGenerating ? 'Processing...' : 'Restructure with INVEST'}
        </button>
      </div>

      <IssuesPanel issues={issues} />
    </div>
  );
};

export default Step2QualityCheck;
