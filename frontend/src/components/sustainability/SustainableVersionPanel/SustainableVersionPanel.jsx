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
  readonly = false,
  sustainableStoryPoints = 0
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedCriteria, setEditedCriteria] = useState('');
  const [editedStoryPoints, setEditedStoryPoints] = useState(sustainableStoryPoints || 0);
  const [isEditingPoints, setIsEditingPoints] = useState(!sustainableStoryPoints || sustainableStoryPoints === 0);
  const [isPointsSaved, setIsPointsSaved] = useState(false);

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

  useEffect(() => {
    setEditedStoryPoints(sustainableStoryPoints || 0);
    if (sustainableStoryPoints > 0) {
      setIsEditingPoints(false);
    } else {
      setIsEditingPoints(true);
    }
  }, [sustainableStoryPoints]);

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

  const handleToggleStoryPoints = () => {
    if (isEditingPoints) {
      if (onUpdate) {
        onUpdate({ sustainableStoryPoints: Number(editedStoryPoints) });
        setIsPointsSaved(true);
        setTimeout(() => setIsPointsSaved(false), 2000);
      }
      setIsEditingPoints(false);
    } else {
      setIsEditingPoints(true);
    }
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
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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

          <div className={styles.storyPointsSection}>
            <label className={styles.storyPointsLabel}>Sustainable Story Points</label>
            <div className={styles.storyPointsRow}>
              <input 
                type="number" 
                className={styles.storyPointsInput} 
                value={editedStoryPoints} 
                onChange={(e) => setEditedStoryPoints(e.target.value)}
                min="0"
                disabled={!isEditingPoints}
                style={!isEditingPoints ? { backgroundColor: '#f1f5f9', color: '#64748b' } : {}}
              />
              <Button 
                variant={isEditingPoints ? "primary" : "outline"} 
                size="sm" 
                onClick={handleToggleStoryPoints}
                disabled={isPointsSaved}
              >
                {isPointsSaved ? <><Check size={14} style={{ marginRight: '4px' }} /> Saved</> : (isEditingPoints ? "Save" : "Edit")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SustainableVersionPanel;
