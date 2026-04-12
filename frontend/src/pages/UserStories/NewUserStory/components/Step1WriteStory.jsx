import React from 'react';
import { Search } from 'lucide-react';
import StatusFooter from './StatusFooter';
import styles from './Step1WriteStory.module.css';

const Step1WriteStory = ({ description, setDescription, onNext, isGenerating }) => {
  return (
    <div className={styles.contentCard}>
      <div className={styles.cardGradientLine}></div>
      <div className={styles.cardBody}>
        <div className={styles.inputSection}>
          <label className={styles.inputLabel}>Initial Draft</label>
          <textarea 
            className={styles.customTextarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what the user needs in your own words. Don't worry about structure yet."
          />
        </div>

        <div className={styles.tipBox}>
          <div className={styles.tipLabel}>Tip:</div>
          <div className={styles.tipContent}>
            Just write naturally. Agent 1 will check and improve the structure for you.
          </div>
        </div>

        <div className={styles.actionRow}>
          <button 
            className={styles.primaryButton}
            onClick={onNext}
            disabled={!description.trim() || isGenerating}
          >
            {isGenerating ? (
              <>Processing...</>
            ) : (
              <>
                <Search size={18} />
                Check Quality with INVEST
              </>
            )}
          </button>
        </div>
      </div>
      <StatusFooter />
    </div>
  );
};

export default Step1WriteStory;
