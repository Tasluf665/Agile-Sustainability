import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Edit2, X, Check } from 'lucide-react';
import Button from '../../common/Button/Button';
import Textarea from '../../common/Textarea/Textarea';
import styles from './OriginalStoryPanel.module.css';

const OriginalStoryPanel = ({ description, structuredDescription, functionalAcceptanceCriteria, storyPoints, onRegenerate, isGenerating, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedStoryPoints, setEditedStoryPoints] = useState(storyPoints || 0);
  const [isEditingPoints, setIsEditingPoints] = useState(!storyPoints || storyPoints === 0);
  const [isPointsSaved, setIsPointsSaved] = useState(false);

  useEffect(() => {
    setEditedDescription(description);
  }, [description]);

  useEffect(() => {
    setEditedStoryPoints(storyPoints || 0);
    if (storyPoints > 0) {
      setIsEditingPoints(false);
    } else {
      setIsEditingPoints(true);
    }
  }, [storyPoints]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedDescription(description);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (onUpdate && editedDescription !== description) {
      onUpdate({ originalDescription: editedDescription });
    }
    setIsEditing(false);
  };

  const handleToggleStoryPoints = () => {
    if (isEditingPoints) {
      if (onUpdate) {
        onUpdate({ storyPoints: Number(editedStoryPoints) });
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
          <FileText size={18} className={styles.titleIcon} />
          <h2 className={styles.title}>Original User Story</h2>
        </div>
        {!isEditing && (
          <button className={styles.editIconButton} onClick={handleEdit}>
            <Edit2 size={16} />
          </button>
        )}
      </div>

      <div className={styles.contentBody}>
        {isEditing ? (
          <div className={styles.editModeContainer}>
            <Textarea 
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={6}
              className={styles.editTextarea}
            />
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
          <div className={styles.quoteBox}>
            <div className={styles.quoteText}>{`"${description}"`}</div>
          </div>
        )}

        {structuredDescription && (
          <div className={styles.structuredSection}>
            <h3 className={styles.sectionTitle}>Structured User Story</h3>
            <div className={styles.structuredBox}>
              <div className={styles.structuredText}>{structuredDescription}</div>
            </div>
          </div>
        )}

        {functionalAcceptanceCriteria && functionalAcceptanceCriteria.length > 0 && (
          <div className={styles.structuredSection}>
            <h3 className={styles.sectionTitle}>Functional Acceptance Criteria</h3>
            <div className={styles.structuredBox}>
              <ul className={styles.criteriaList}>
                {functionalAcceptanceCriteria.map((criterion, idx) => (
                  <li key={idx} className={styles.criteriaItem}>{criterion}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className={styles.contextSection}>
        <Button 
          variant="outline" 
          onClick={onRegenerate}
          isLoading={isGenerating}
          className={styles.generateButton}
        >
          <Sparkles size={14} style={{ marginRight: '8px' }} />
          Generate Sustainable User Story
        </Button>

        <div className={styles.storyPointsSection}>
          <label className={styles.storyPointsLabel}>Original Story Points</label>
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
    </div>
  );
};

export default OriginalStoryPanel;
