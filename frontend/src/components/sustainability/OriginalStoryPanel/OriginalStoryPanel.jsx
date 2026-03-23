import React from 'react';
import { FileText, Sparkles } from 'lucide-react';
import Button from '../../common/Button/Button';
import styles from './OriginalStoryPanel.module.css';

const OriginalStoryPanel = ({ description, priority, feature, onRegenerate, isGenerating }) => {
  return (
    <div className={styles.panelContainer}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <FileText size={18} className={styles.titleIcon} />
          <h2 className={styles.title}>Original User Story</h2>
        </div>
      </div>

      <div className={styles.quoteBox}>
        <div className={styles.quoteText}>{`"${description}"`}</div>
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
