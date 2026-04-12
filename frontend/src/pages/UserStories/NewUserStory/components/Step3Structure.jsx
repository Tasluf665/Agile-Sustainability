import React, { useState } from 'react';
import { Send, ArrowLeft, Info, FileText } from 'lucide-react';
import AuditLogCard from './AuditLogCard';
import styles from './Step3Structure.module.css';

const Step3Structure = ({ onNext, onBack }) => {
  const [draftContent, setDraftContent] = useState(
`As a registered viewer,
I want to access the historical carbon offset data of my previous three projects,
So that I can generate a comparative report for the quarterly sustainability audit.

Acceptance Criteria:
- Data must be fetched within 2.5 seconds.
- Report must be exportable in PDF and CSV.
- Must include a "Total Carbon Neutrality" indicator.`
  );

  return (
    <div className={styles.step3Layout}>
      {/* Left Column: Editable Draft */}
      <div className={styles.leftColumn}>
        <div className={styles.agentHeader}>
          <div className={styles.agentBadge}>AGENT 1 — QUALITY CHECKER</div>
          <div className={styles.tipBadge}>
            <Info size={14} />
            <span>You can edit this before sending it to Agent 2.</span>
          </div>
        </div>

        <div className={styles.draftCard}>
          <div className={styles.draftCardBlur}></div>
          <div className={styles.cardInner}>
            <header className={styles.cardHeader}>
              <span className={styles.cardHeaderLabel}>STRUCTURED STORY DRAFT</span>
              <FileText size={14} color="#94a3b8" />
            </header>
            
            <div className={styles.draftArea}>
              <textarea
                className={styles.draftText}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                spellCheck="false"
              />
            </div>
          </div>
        </div>

        <div className={styles.actionRow}>
          <button className={styles.generateButton} onClick={onNext}>
            <span style={{ fontSize: '18px' }}>🌱</span>
            Generate Sustainable Version
          </button>
          <button className={styles.backButton} onClick={onBack}>
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      {/* Right Column: Audit Log */}
      <div className={styles.rightColumn}>
        <AuditLogCard />
      </div>
    </div>
  );
};

export default Step3Structure;
