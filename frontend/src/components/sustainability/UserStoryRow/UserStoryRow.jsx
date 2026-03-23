import React from 'react';
import { Leaf, Zap, Database, Trash2, Droplets } from 'lucide-react';
import Badge from '../../common/Badge/Badge';
import Button from '../../common/Button/Button';
import AvatarGroup from '../../common/AvatarGroup/AvatarGroup';
import styles from './UserStoryRow.module.css';

const FOCUS_AREAS = [
  { id: 'ENERGY', label: 'Energy Efficiency', icon: Zap },
  { id: 'DATA', label: 'Data Minimization', icon: Database },
  { id: 'CARBON', label: 'Carbon Neutral Hosting', icon: Leaf },
  { id: 'WASTE', label: 'Digital Waste Reduction', icon: Trash2 },
  { id: 'WATER', label: 'Water Conservation', icon: Droplets }
];

const getStatusVariant = (status) => {
  switch(status) {
    case 'APPROVED':
    case 'ACCEPTED': return 'success';
    case 'IN_REVIEW':
    case 'PENDING REVIEW': return 'warning';
    case 'DRAFT':
    case 'IN PROGRESS': return 'info';
    default: return 'primary';
  }
};

const getStatusLabel = (status) => {
  if (!status) return 'UNKNOWN';
  return String(status).replace('_', ' ').toUpperCase();
};

const UserStoryRow = ({ status, focusArea, title, useCaseCount = 0, assignees = [], onViewStory, onAddUseCase }) => {
  // Use lower case focusArea as string, mapping to FOCUS_AREAS array
  const faData = FOCUS_AREAS.find(fa => fa.id === String(focusArea).toUpperCase()) || FOCUS_AREAS[0];

  return (
    <div className={styles.rowWrapper}>
      <div className={styles.content}>
        <div className={styles.metaRow}>
          <Badge label={getStatusLabel(status)} variant={getStatusVariant(status)} />
          <Badge label={faData.label} icon={faData.icon} variant="primary" />
          <h4 className={styles.title}>{title}</h4>
        </div>
        
        <div className={styles.actionsRow}>
          <div className={styles.useCaseLink}>
            <span className={styles.useCaseCount}>{useCaseCount} Use Case{useCaseCount !== 1 ? 's' : ''}</span>
          </div>
          <div className={styles.assigneesBlock}>
            <AvatarGroup avatars={assignees} max={3} />
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <Button variant="ghost" onClick={onViewStory}>View Story</Button>
        <Button variant="outline" onClick={onAddUseCase}>Add Use Case</Button>
      </div>
    </div>
  );
};

export default UserStoryRow;
