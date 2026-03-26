import React from 'react';

import { Sparkles, Check, Leaf } from 'lucide-react';
import Badge from '../../common/Badge/Badge';
import Button from '../../common/Button/Button';
import UsageIndicator from '../../common/UsageIndicator/UsageIndicator';
import styles from './AISuggestionPanel.module.css';

const AISuggestionPanel = ({
  type = 'story', // 'story' or 'useCase'
  status = 'waiting',
  suggestion = '',
  acceptanceCriteria = [], // Repurposed for steps in useCase type
  sustainableFlow = [],
  sustainabilityNotes = '',
  co2SavingPerHour = '',
  dimension = '',
  focusArea = 'ENERGY EFFICIENCY',
  co2ImpactNote = '',
  onAccept,
  onReject,
  usageCount = 12,
  usageUnit = 'teammates',
  usagePeriod = 'week'
}) => {
  return (
    <div className={`${styles.panelContainer} ${status === 'waiting' ? styles.waitingContainer : ''}`}>
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
            <h4 className={styles.waitingTitle}>AI Suggestion</h4>
            <div className={styles.waitingText}>
              <p>Your sustainable {type === 'useCase' ? 'use case' : 'suggestion'} will appear here. Our</p>
              <p>AI will analyze your flow and suggest eco-</p>
              <p>friendly enhancements.</p>
            </div>
            {/* Illustration Placeholder matching Figma */}
            <div className={styles.illustrationPlaceholder}>
              <div className={styles.illustLine} style={{ width: '192px' }}></div>
              <div className={styles.illustLine} style={{ width: '256px' }}></div>
              <div className={styles.illustLine} style={{ width: '160px' }}></div>
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
                    <Badge text={dimension || focusArea.replace(/_/g, ' ')} color="success" size="sm" />
                </div>
                
                <div className={styles.resultContentBox}>
                    {type === 'story' ? (
                      <>
                        <p className={styles.resultText}>"{suggestion}"</p>
                        <div className={styles.criteriaSection}>
                            <h5 className={styles.criteriaTitle}>Acceptance Criteria</h5>
                            <ul className={styles.criteriaList}>
                                {acceptanceCriteria.map((criterion, idx) => (
                                    <li key={idx} className={styles.criteriaItem}>
                                        <Check size={15} className={styles.checkIcon} />
                                        <span>{criterion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                      </>
                    ) : (
                      <div className={styles.useCaseResult}>
                        <h5 className={styles.useCaseTitleResult}>{suggestion}</h5>
                        <div className={styles.flowSection}>
                          <h6 className={styles.flowTitle}>Optimized Flow</h6>
                          <div className={styles.flowList}>
                            {sustainableFlow.map((step, idx) => {
                              const stepText = typeof step === 'object' ? step.description : step;
                              const action = typeof step === 'object' ? step.action : null;
                              const dim = typeof step === 'object' ? step.sustainabilityDimension : null;

                              return (
                                <div key={idx} className={`${styles.flowStepItem} ${action ? styles[`action${action}`] : ''}`}>
                                  <div className={styles.flowStepNumber}>{idx + 1}</div>
                                  <div className={styles.flowStepContent}>
                                    <div className={styles.flowStepText}>{stepText}</div>
                                    {dim && <span className={styles.stepDimensionBadge}>{dim}</span>}
                                  </div>
                                  {action && action !== 'KEEP' && (
                                    <div className={styles.actionBadge} data-action={action}>
                                      {action}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {sustainabilityNotes && (
                          <div className={styles.notesSection}>
                            <h6 className={styles.notesTitle}>Sustainability Notes</h6>
                            <p className={styles.notesText}>{sustainabilityNotes}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {(co2ImpactNote || co2SavingPerHour) && (
                        <div className={styles.impactSection}>
                            <Leaf size={14} className={styles.impactIcon} />
                            <span>{co2ImpactNote || `Est. saving: ${co2SavingPerHour} / hour`}</span>
                        </div>
                    )}
                </div>
                
                <div className={styles.resultActions}>
                    <Button variant="primary" onClick={onAccept} className={styles.acceptButton}>
                        <Check size={14} style={{ marginRight: '8px' }}/> Accept
                    </Button>
                    <Button variant="outline" onClick={onReject} className={styles.regenerateButton}>
                        Regenerate
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
