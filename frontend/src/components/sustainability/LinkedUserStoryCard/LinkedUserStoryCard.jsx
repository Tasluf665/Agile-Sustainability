import React from 'react';
import { Link2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './LinkedUserStoryCard.module.css';

const LinkedUserStoryCard = ({
  status,
  storyExcerpt,
  onViewStory
}) => {
  // Parse story excerpt for "As a X, I want to Y so that Z"
  const renderExcerpt = (text) => {
    if (!text) return null;
    
    // Quick match for standard user story format
    const match = text.match(/As an? (.*?), I want to (.*?) so that (.*)$/i);
    
    if (match) {
      const [_, actor, action, benefit] = match;
      const isAn = text.toLowerCase().startsWith('as an ');
      return (
        <p className={styles.excerpt}>
          "As {isAn ? 'an' : 'a'} <span className={styles.boldGreen}>{actor}</span>, I want to <span className={styles.boldGreen}>{action}</span> so that <span className={styles.boldGreen}>{benefit}</span>"
        </p>
      );
    }
    
    // Fallback if not matching format
    return <p className={styles.excerpt}>"{text}"</p>;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <Link2 size={16} color="#0f172a" />
          <h3 className={styles.headerTitle}>Linked User Story</h3>
        </div>
        
        <div className={styles.statusArea}>
          <span className={styles.statusLabel}>Status:</span>
          {status && (
            <div className={`${styles.statusBadge} ${styles[status.toLowerCase().replace(' ', '')] || ''}`}>
              {status}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.excerptContainer}>
          {renderExcerpt(storyExcerpt)}
        </div>
        
        <div className={styles.actionContainer}>
          {onViewStory ? (
            <button onClick={onViewStory} className={styles.viewStoryLink}>
              View Story <ArrowRight size={16} />
            </button>
          ) : (
            <span className={styles.viewStoryLink}>
              View Story <ArrowRight size={16} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedUserStoryCard;
