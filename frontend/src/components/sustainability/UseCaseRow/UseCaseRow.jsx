import React from 'react';
import { ArrowRight } from 'lucide-react';
import Badge from '../../common/Badge/Badge';
import styles from './UseCaseRow.module.css';

const UseCaseRow = ({
  id,
  title,
  status,
  lastEdited,
  originalSummary,
  sustainableSummary,
  onViewDetails
}) => {
  const getBadgeColor = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending review': return 'warning';
      case 'in progress': return 'info';
      default: return 'default'; // Draft
    }
  };

  return (
    <div className={styles.rowContainer}>
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h3 className={styles.titleText}>{`${id}: ${title}`}</h3>
          <Badge text={status} color={getBadgeColor(status)} />
          <span className={styles.lastEditedText}>{lastEdited}</span>
        </div>
        <button className={styles.viewDetailsBtn} onClick={onViewDetails}>
          View Details <ArrowRight size={14} style={{ marginLeft: '4px' }} />
        </button>
      </div>

      <div className={styles.summariesGrid}>
        <div className={styles.summaryBoxOriginal}>
          <div className={styles.summaryLabel}>ORIGINAL</div>
          <p className={styles.summaryTextOriginal}>{originalSummary}</p>
        </div>
        
        <div className={styles.summaryBoxSustainable}>
          <div className={styles.summaryLabelSustainable}>SUSTAINABLE</div>
          <p className={styles.summaryTextSustainable}>{sustainableSummary}</p>
        </div>
      </div>
    </div>
  );
};

export default UseCaseRow;
