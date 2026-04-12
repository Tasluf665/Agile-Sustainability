import React from 'react';
import { Search, XCircle, Info } from 'lucide-react';
import styles from './Step2QualityCheck.module.css';

const IssuesPanel = ({ issues }) => {
  return (
    <aside className={styles.issuesSidebar}>
      <div className={styles.issuesPanel}>
        <div className={styles.issuesHeader}>
          <Search size={18} className={styles.issueIcon} style={{ color: '#1c5f20' }} />
          <span className={styles.issuesTitle}>Issues Found</span>
        </div>
        <div className={styles.issuesList}>
          {issues.map((issue, idx) => (
            <div key={idx} className={styles.issueItem}>
              <XCircle size={14} className={styles.issueIcon} />
              <div className={styles.issueText}>
                {issue.text}
                {issue.highlight && <span className={styles.issueHighlight}>{issue.highlight}</span>}
                {issue.suffix && issue.suffix}
              </div>
            </div>
          ))}

          <div className={styles.emptyStateIllustration}>
            <div className={styles.emptyStateCircle}>
              <Info size={32} />
            </div>
            <p className={styles.emptyStateText}>
              Resolve the identified issues to<br />archive a perfect green score.
            </p>
          </div>
        </div>
        <div className={styles.impactFooter}>
          <span className={styles.impactLabel}>
            SUSTAINABILITY IMPACT: LOW EFFORT / HIGH GAIN
          </span>
        </div>
      </div>
    </aside>
  );
};

export default IssuesPanel;
