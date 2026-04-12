import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, Leaf, ShieldCheck, Globe } from 'lucide-react';
import styles from './Step4Sustainability.module.css';

const Step4Sustainability = ({ onAccept, onBack }) => {
  const functionalDraft = {
    story: "As a delivery driver, I want to see the fastest route on my dashboard so that I can complete more orders per hour.",
    criteria: [
      "Dashboard must display the 'Fastest' route as the primary option by default.",
      "System calculates estimated arrival time based on real-time traffic data.",
      "One-tap navigation start from the dashboard interface."
    ]
  };

  const sustainableDraft = {
    story: (
      <>
        "As a delivery driver, I want to see the most <span className={styles.storyHighlight}>carbon-efficient routes</span> prioritized on my dashboard, so that I can reduce fleet emissions while meeting delivery windows."
      </>
    ),
    criteria: [
      "Dashboard must display CO2 savings for the 'Green' route compared to the fastest route.",
      "Driver notification system confirms if emission reduction target is met post-trip.",
      "API integration with fleet telemetry must update idle-time metrics in real-time.",
      "Route algorithm must favor non-congested zones to minimize brake wear particulates."
    ],
    tradeoff: "Prioritizing carbon efficiency may increase average transit time by 4.2% during peak hours but reduces idle time emissions by 18%."
  };

  return (
    <div className={styles.step4Layout}>
      <div className={styles.comparisonGrid}>
        
        {/* Left Column: Optimized Functional */}
        <div className={styles.column}>
          <div className={styles.badgeRow}>
            <div className={`${styles.badge} ${styles.optimizedBadge}`}>
               <ShieldCheck size={12} style={{ marginRight: '6px' }} />
               OPTIMIZED DRAFT (AGENT 1)
            </div>
          </div>

          <div className={styles.contentCard}>
            <header className={`${styles.cardHeader} ${styles.functionalHeader}`}>
              <span className={`${styles.headerLabel} ${styles.functionalLabel}`}>STRUCTURED USER STORY</span>
            </header>
            <div className={styles.cardBody}>
              <p className={styles.storyText}>"{functionalDraft.story}"</p>
            </div>
          </div>

          <div className={styles.contentCard}>
            <header className={`${styles.cardHeader} ${styles.functionalHeader}`}>
              <span className={`${styles.headerLabel} ${styles.functionalLabel}`}>FUNCTIONAL ACCEPTANCE CRITERIA</span>
            </header>
            <div className={styles.cardBody}>
              <ul className={styles.criteriaList}>
                {functionalDraft.criteria.map((item, i) => (
                  <li key={i} className={styles.criteriaItem}>
                    <div className={styles.bullet} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Sustainable Version */}
        <div className={styles.column}>
          <div className={styles.badgeRow}>
            <div className={`${styles.badge} ${styles.sustainableBadge}`}>
               <Globe size={12} style={{ marginRight: '6px' }} />
               SUSTAINABLE VERSION
            </div>
          </div>

          <div className={`${styles.contentCard} ${styles.sustainableCard}`}>
            <header className={`${styles.cardHeader} ${styles.sustainableHeader}`}>
              <span className={`${styles.headerLabel} ${styles.sustainableLabel}`}>SUSTAINABLE STORY</span>
            </header>
            <div className={styles.cardBody}>
              <p className={styles.storyText}>{sustainableDraft.story}</p>
              
              <div className={styles.tradeoffAlert} style={{ marginTop: '24px' }}>
                <AlertTriangle className={styles.tradeoffIcon} size={18} />
                <div className={styles.tradeoffText}>
                  <span className={styles.tradeoffTitle}>Trade-off Note:</span>
                  {sustainableDraft.tradeoff}
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.contentCard} ${styles.sustainableCard}`}>
            <header className={`${styles.cardHeader} ${styles.sustainableHeader}`}>
              <span className={`${styles.headerLabel} ${styles.sustainableLabel}`}>SUSTAINABLE ACCEPTANCE CRITERIA</span>
            </header>
            <div className={styles.cardBody}>
              <ul className={styles.criteriaList}>
                {sustainableDraft.criteria.map((item, i) => (
                  <li key={i} className={styles.criteriaItem}>
                    <div className={`${styles.bullet} ${styles.greenBullet}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Final Action Row */}
          <div className={styles.actionRow}>
            <button className={styles.acceptButton} onClick={onAccept}>
              <CheckCircle2 size={18} />
              Accept Sustainable Version
            </button>
            <button className={styles.keepOriginalButton} onClick={onBack}>
              <XCircle size={18} />
              Keep Original
            </button>
          </div>
        </div>
      </div>

      {/* Why This Matters Footer */}
      <section className={styles.whyMatters}>
        <div className={styles.whyHeader}>
          <Info size={16} color="#1c5f20" />
          <h4 className={styles.whyTitle}>WHY THIS MATTERS?</h4>
        </div>
        <p className={styles.whyText}>
          Embedding sustainability directly into User Stories ensures that non-functional requirements (NFRs) 
          like carbon footprint are prioritized during the sprint planning phase rather than treated as afterthoughts.
        </p>
      </section>
    </div>
  );
};

export default Step4Sustainability;
