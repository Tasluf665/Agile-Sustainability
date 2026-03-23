import React from 'react';
import Badge from '../../common/Badge/Badge';
import Button from '../../common/Button/Button';
import styles from './ProjectCard.module.css';

const ProjectCard = ({ project, onOpen }) => {
  const { name, industry, description, focusAreas, userStoriesCount, useCasesCount } = project;

  // Banner gradient based on industry
  const getBannerGradient = (ind) => {
    switch (ind) {
      case 'Tech': return 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)';
      case 'Retail': return 'linear-gradient(135deg, #10b981 0%, #065f46 100%)';
      default: return 'linear-gradient(135deg, #1c5f20 0%, #4b6546 100%)';
    }
  };

  return (
    <div className={styles.card}>
      <div 
        className={styles.banner} 
        style={{ background: getBannerGradient(industry) }}
      >
        <h3 className={styles.bannerTitle}>{name}</h3>
      </div>
      
      <div className={styles.content}>
        <div className={styles.industryBadge}>
          <span className={styles.industryText}>{industry}</span>
        </div>
        
        <p className={styles.description}>{description}</p>
        
        <div className={styles.focusAreas}>
          {focusAreas.map((area, idx) => (
            <Badge key={idx} label={area.label} color={area.color} />
          ))}
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{userStoriesCount}</span>
            <span className={styles.statLabel}>User Stories</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{useCasesCount}</span>
            <span className={styles.statLabel}>Use Cases</span>
          </div>
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" fullWidth onClick={onOpen}>
            Open Project →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
