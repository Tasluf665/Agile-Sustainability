import React, { useState, useEffect } from 'react';
import { Leaf, Check, Sparkles, Edit2, X } from 'lucide-react';
import Badge from '../../common/Badge/Badge';
import Button from '../../common/Button/Button';
import Textarea from '../../common/Textarea/Textarea';
import styles from './SustainableVersionPanel.module.css';

const SustainableVersionPanel = ({ 
  description, 
  focusArea, 
  acceptanceCriteria,
  co2ImpactNote,
  onAccept, 
  onRegenerate, 
  onUpdate,
  isAccepting,
  isRegenerating,
  isApproved = false,
  readonly = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedCriteria, setEditedCriteria] = useState('');

  useEffect(() => {
    setEditedDescription(description);
  }, [description]);

  useEffect(() => {
    if (Array.isArray(acceptanceCriteria)) {
      setEditedCriteria(acceptanceCriteria.join('\n'));
    } else {
      setEditedCriteria('');
    }
  }, [acceptanceCriteria]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedDescription(description);
    setEditedCriteria(acceptanceCriteria ? acceptanceCriteria.join('\n') : '');
    setIsEditing(false);
  };

  const handleSave = () => {
    if (onUpdate) {
      const criteriaArray = (editedCriteria || '')
        .split('\n')
        .map(c => c.trim())
        .filter(c => c !== '');
      
      onUpdate({
        sustainableStory: editedDescription,
        acceptanceCriteria: criteriaArray
      });
    }
    setIsEditing(false);
  };
  return (
    <div className={styles.panelContainer}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <Leaf size={16} className={styles.titleIcon} />
          <h2 className={styles.title}>Sustainable Version</h2>
        </div>
        <div className={styles.headerRight}>
          {!isEditing && !readonly && (
            <button className={styles.editIconButton} onClick={handleEdit} title="Edit Sustainable Version">
              <Edit2 size={16} />
            </button>
          )}
          <Badge text={focusArea ? focusArea.replace(/_/g, ' ') : 'ENERGY EFFICIENCY'} color="success" size="sm" className={styles.focusBadge} />
        </div>
      </div>

      <div className={styles.contentBox}>
        {isEditing ? (
          <div className={styles.editModeContainer}>
            <div className={styles.editField}>
              <label className={styles.editLabel}>Sustainable Description</label>
              <Textarea 
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={4}
                className={styles.editTextarea}
              />
            </div>
            
            <div className={styles.editField}>
              <label className={styles.editLabel}>Acceptance Criteria (One per line)</label>
              <Textarea 
                value={editedCriteria}
                onChange={(e) => setEditedCriteria(e.target.value)}
                rows={6}
                className={styles.editTextarea}
              />
            </div>

            <div className={styles.editActions}>
              <Button variant="outline" size="sm" onClick={handleCancel} className={styles.cancelBtn}>
                <X size={14} style={{ marginRight: '4px' }} />
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} className={styles.saveBtn}>
                 <Check size={14} style={{ marginRight: '4px' }} />
                 Save
              </Button>
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
        
        {co2ImpactNote && !isEditing && (
            <div style={{ marginTop: '16px', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Leaf size={14} style={{ flexShrink: 0, marginTop: '2px', color: '#10b981' }} />
                <span>{co2ImpactNote}</span>
            </div>
        )}
      </div>

      {!isEditing && (
        <div className={styles.actionsBox}>
          {!isApproved && !readonly && (
            <Button 
              variant="primary" 
              onClick={onAccept} 
              isLoading={isAccepting}
              className={styles.acceptButton}
            >
              <Check size={14} style={{ marginRight: '8px' }}/> Accept
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={onRegenerate} 
            isLoading={isRegenerating}
            className={styles.regenerateButton}
            disabled={isAccepting}
          >
            <Sparkles size={14} style={{ marginRight: '8px' }}/> Regenerate
          </Button>
        </div>
      )}
    </div>
  );
};

export default SustainableVersionPanel;
