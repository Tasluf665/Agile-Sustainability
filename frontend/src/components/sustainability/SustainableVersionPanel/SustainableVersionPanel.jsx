import React from 'react';
import { Leaf, Check } from 'lucide-react';
import Badge from '../../common/Badge/Badge';
import Button from '../../common/Button/Button';
import styles from './SustainableVersionPanel.module.css';

const SustainableVersionPanel = ({ 
  description, 
  focusArea, 
  acceptanceCriteria,
  co2ImpactNote,
  onAccept, 
  onReject, 
  isAccepting,
  readonly = false
}) => {
  return (
    <div className={styles.panelContainer}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Leaf size={16} className={styles.titleIcon} />
          <h2 className={styles.title}>Sustainable Version</h2>
        </div>
        <div className={styles.badgeWrapper}>
          <Badge text={focusArea ? focusArea.replace(/_/g, ' ') : 'ENERGY EFFICIENCY'} color="success" size="sm" className={styles.focusBadge} />
        </div>
      </div>

      <div className={styles.contentBox}>
        <p className={styles.descriptionText}>{`"${description}"`}</p>
        
        <div className={styles.criteriaSection}>
          <h3 className={styles.criteriaTitle}>Acceptance Criteria</h3>
          <ul className={styles.criteriaList}>
            {acceptanceCriteria && acceptanceCriteria.map((criterion, idx) => (
              <li key={idx} className={styles.criteriaItem}>
                <Check size={15} className={styles.checkIcon} />
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {co2ImpactNote && (
            <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Leaf size={14} style={{ flexShrink: 0, marginTop: '2px', color: '#10b981' }} />
                <span>{co2ImpactNote}</span>
            </div>
        )}
      </div>

      {!readonly && (
        <div className={styles.actionsBox}>
          <Button 
            variant="primary" 
            onClick={onAccept} 
            isLoading={isAccepting}
            className={styles.acceptButton}
          >
            <Check size={14} style={{ marginRight: '8px' }}/> Accept
          </Button>
          <Button 
            variant="outline" 
            onClick={onReject} 
            className={styles.rejectButton}
            disabled={isAccepting}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
};

export default SustainableVersionPanel;
