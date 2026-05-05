import React, { useState } from 'react';
import { ArrowLeft, Info, FileText, Edit2, X, Check } from 'lucide-react';
import AuditLogCard from './AuditLogCard';
import styles from './Step3Structure.module.css';

const Step3Structure = ({ originalDraft, initialDraft, acceptanceCriteria, auditChanges, onUpdate, onNext, onBack, isGenerating }) => {
  const [draftContent, setDraftContent] = useState(initialDraft || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDraft, setEditedDraft] = useState(draftContent);

  // Update local state if prop changes (e.g., on first API result)
  React.useEffect(() => {
    if (initialDraft) {
      setDraftContent(initialDraft);
      setEditedDraft(initialDraft);
    }
  }, [initialDraft]);

  const handleEditClick = () => {
    setEditedDraft(draftContent);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setDraftContent(editedDraft);
    if (onUpdate) {
      onUpdate(editedDraft);
    }
    setIsEditing(false);
  };

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

        {originalDraft && (
          <div className={styles.originalDraftBox}>
            <span className={styles.originalDraftLabel}>ORIGINAL DRAFT</span>
            <p className={styles.originalDraftText}>"{originalDraft}"</p>
          </div>
        )}

        <div className={styles.draftCard}>
          <div className={styles.draftCardBlur}></div>
          <div className={styles.cardInner}>
            <header className={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={styles.cardHeaderLabel}>STRUCTURED STORY DRAFT</span>
                <FileText size={14} color="#94a3b8" />
              </div>
              {!isEditing && (
                <button className={styles.editIconButton} onClick={handleEditClick} title="Edit Draft">
                  <Edit2 size={14} />
                </button>
              )}
            </header>
            
            <div className={styles.draftArea}>
              {isEditing ? (
                <div className={styles.editModeContainer}>
                  <textarea
                    className={styles.draftTextEditable}
                    value={editedDraft}
                    onChange={(e) => setEditedDraft(e.target.value)}
                    spellCheck="false"
                  />
                  <div className={styles.editActions}>
                    <button className={styles.cancelBtn} onClick={handleCancelEdit}>
                      <X size={14} /> Cancel
                    </button>
                    <button className={styles.saveBtn} onClick={handleSaveEdit}>
                      <Check size={14} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.draftTextDisplay}>
                  {draftContent}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acceptance Criteria Section */}
        {acceptanceCriteria && acceptanceCriteria.length > 0 && (
          <div className={styles.acContainer}>
            <h3 className={styles.acTitle}>Acceptance Criteria</h3>
            <div className={styles.acList}>
              {acceptanceCriteria.map((ac, index) => (
                <div key={index} className={styles.acItem}>
                  <div className={styles.acDot}></div>
                  <p className={styles.acText}>{ac}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.actionRow}>
          <button 
            className={styles.generateButton} 
            onClick={onNext}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>Processing...</>
            ) : (
              <>
                <span style={{ fontSize: '18px' }}>🌱</span>
                Generate Sustainable Version
              </>
            )}
          </button>
          <button 
            className={styles.backButton} 
            onClick={onBack}
            disabled={isGenerating}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      {/* Right Column: Audit Log */}
      <div className={styles.rightColumn}>
        <AuditLogCard changes={auditChanges} />
      </div>
    </div>
  );
};

export default Step3Structure;
