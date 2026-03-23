import React from 'react';

import { Sparkles, Check, Leaf } from 'lucide-react';
import Badge from '../../common/Badge/Badge';
import Button from '../../common/Button/Button';
import UsageIndicator from '../../common/UsageIndicator/UsageIndicator';
import styles from './AISuggestionPanel.module.css';

const AISuggestionPanel = ({
  status = 'waiting',
  suggestion = '',
  acceptanceCriteria = [],
  focusArea = 'ENERGY EFFICIENCY',
  co2ImpactNote = '',
  onAccept,
  onReject,
  usageCount = 12,
  usageUnit = 'teammates',
  usagePeriod = 'week'
}) => {
  return (
    <div className={styles.panelContainer}>
      <div className={styles.panelHeader}>
        <div className={styles.headerTitleRow}>
          <div className={styles.headerIconWrapper}>
            <Sparkles size={18} className={styles.headerIcon} />
          </div>
          <h3 className={styles.headerTitle}>AI Suggestion</h3>
        </div>
        <div className={styles.badgeWrapper}>
          <Badge text="BETA" color="success" className={styles.betaBadge} />
        </div>
      </div>

      <div className={styles.panelBody}>
        {status === 'waiting' && (
          <div className={styles.waitingState}>
            <div className={styles.waitingIconWrapper}>
              <div className={styles.waitingIconCircle}>
                <Leaf size={28} className={styles.waitingIcon} />
              </div>
            </div>
            <h4 className={styles.waitingTitle}>Waiting for input</h4>
            <div className={styles.waitingText}>
              <p>Your sustainable suggestion will appear here</p>
              <p>once you click the generate button.</p>
            </div>
          </div>
        )}

        {status === 'loading' && (
          <div className={styles.loadingState}>
            <div className={styles.loadingPulse}>
              <div className={styles.bounceLoader}>
                <div></div><div></div><div></div>
              </div>
            </div>
            <p className={styles.loadingText}>Analyzing sustainability potential...</p>
          </div>
        )}

        {status === 'result' && (
          <div className={styles.resultState}>
            <div className={styles.resultCardWrapper}>
                <div className={styles.resultHeader}>
                    <div className={styles.resultHeaderLeft}>
                        <Leaf size={16} className={styles.resultHeaderIcon} />
                        <h4 className={styles.resultHeaderTitle}>Sustainable Version</h4>
                    </div>
                    <Badge text={focusArea ? focusArea.replace(/_/g, ' ') : 'ENERGY EFFICIENCY'} color="success" size="sm" />
                </div>
                
                <div className={styles.resultContentBox}>
                    <p className={styles.resultText}>"{suggestion}"</p>
                    
                    <div className={styles.criteriaSection}>
                        <h5 className={styles.criteriaTitle}>Acceptance Criteria</h5>
                        <ul className={styles.criteriaList}>
                            {acceptanceCriteria.length > 0 ? (
                                acceptanceCriteria.map((criterion, idx) => (
                                    <li key={idx} className={styles.criteriaItem}>
                                        <Check size={15} className={styles.checkIcon} />
                                        <span>{criterion}</span>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li className={styles.criteriaItem}>
                                        <Check size={15} className={styles.checkIcon} />
                                        <span>System defaults to 'Standard' if screen size &lt; 7 inches</span>
                                    </li>
                                    <li className={styles.criteriaItem}>
                                        <Check size={15} className={styles.checkIcon} />
                                        <span>User can toggle 'Eco-Mode' to limit data usage by 40%</span>
                                    </li>
                                    <li className={styles.criteriaItem}>
                                        <Check size={15} className={styles.checkIcon} />
                                        <span>Server selection prioritized by green energy certification</span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                    {co2ImpactNote && (
                        <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <Leaf size={14} style={{ flexShrink: 0, marginTop: '2px', color: '#10b981' }} />
                            <span>{co2ImpactNote}</span>
                        </div>
                    )}
                </div>
                
                <div className={styles.resultActions}>
                    <Button variant="primary" onClick={onAccept} className={styles.acceptButton}>
                        <Check size={14} style={{ marginRight: '8px' }}/> Accept
                    </Button>
                    <Button variant="outline" onClick={onReject} className={styles.rejectButton}>
                        Reject
                    </Button>
                </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.panelFooter}>
        <UsageIndicator count={usageCount} unit={usageUnit} period={usagePeriod} />
      </div>
    </div>
  );
};



export default AISuggestionPanel;
