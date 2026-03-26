import React from 'react';
import { Leaf, Sparkles, Lightbulb, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './SustainableUseCasePanel.module.css';

const SustainableUseCasePanel = ({
  optimizedTitle,
  modifiedFlow = [],
  sustainabilityNotes,
  dimension,
  co2SavingPerHour,
  status = 'IN REVIEW',
  onAccept,
  onReject,
  onRegenerate,
  isAccepting,
}) => {
  const isApproved = status === 'APPROVED';
  return (
    <div className={styles.sustainablePanel}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Leaf size={16} color="#1c5f20" />
          <h3 className={styles.headerTitle}>Sustainable Use Case</h3>
        </div>
        <div className={styles.aiBadge}>
          <Sparkles size={11} color="#ffffff" />
          <span>AI Optimized</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <span className={styles.label}>Optimized Title</span>
          <span className={styles.value}>{optimizedTitle || '—'}</span>
        </div>
        
        <div className={styles.section}>
          <span className={styles.label}>Modified Flow</span>
          <ol className={styles.flowList}>
            {modifiedFlow && modifiedFlow.length > 0 ? (
              modifiedFlow.map((step, index) => {
                const isHighlight = step.action === 'ENHANCE' || step.action === 'REPLACE';
                return (
                  <li 
                    key={index} 
                    className={`${styles.flowItem} ${isHighlight ? styles.flowItemHighlight : ''}`}
                  >
                    <span className={styles.stepText}>
                      {typeof step === 'object' ? (step.description || step.text || step.value || JSON.stringify(step)) : step}
                    </span>
                  </li>
                );
              })
            ) : (
              <span className={styles.text}>—</span>
            )}
          </ol>
        </div>
        
        {sustainabilityNotes && (
          <div className={styles.notesBox}>
            <div className={styles.notesTitle}>
              <Lightbulb size={12} color="#1c5f20" />
              <span>Sustainability Notes</span>
            </div>
            <p className={styles.notesText}>{sustainabilityNotes}</p>
          </div>
        )}
        
        <div className={styles.pillsContainer}>
          {dimension && (
            <div className={styles.pill}>
              Dimension: {dimension}
            </div>
          )}
          {co2SavingPerHour && (
            <div className={styles.pill}>
              CO2 Saving: {co2SavingPerHour}
            </div>
          )}
        </div>
        
        <div className={styles.actionsContainer}>
          {isApproved ? (
            <Button
              variant="outline"
              onClick={onRegenerate}
              className={styles.rejectButton}
              icon={RefreshCw}
            >
              Regenerate
            </Button>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={onAccept}
                disabled={isAccepting}
                className={styles.acceptButton}
                icon={CheckCircle2}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                onClick={onReject}
                disabled={isAccepting}
                className={styles.rejectButton}
                icon={XCircle}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SustainableUseCasePanel;
