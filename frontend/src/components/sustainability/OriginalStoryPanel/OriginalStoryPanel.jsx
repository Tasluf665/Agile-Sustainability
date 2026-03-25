import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, Edit2, X, Check } from 'lucide-react';
import Button from '../../common/Button/Button';
import Textarea from '../../common/Textarea/Textarea';
import styles from './OriginalStoryPanel.module.css';

const OriginalStoryPanel = ({ description, priority, feature, onRegenerate, isGenerating, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);

  useEffect(() => {
    setEditedDescription(description);
  }, [description]);

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
      </div>

      <div className={styles.contextSection}>
        <h3 className={styles.contextTitle}>Original Context</h3>
        <div className={styles.tagsRow}>
          {priority && (
            <div className={styles.tagPill}>
              Priority: {priority}
            </div>
          )}
          {feature && (
            <div className={styles.tagPill}>
              Feature: {feature}
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          onClick={onRegenerate}
          isLoading={isGenerating}
          className={styles.generateButton}
        >
          <Sparkles size={14} style={{ marginRight: '8px' }} />
          Generate Sustainable User Story
        </Button>
      </div>
    </div>
  );
};

export default OriginalStoryPanel;
