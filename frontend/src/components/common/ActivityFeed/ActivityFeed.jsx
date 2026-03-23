import React from 'react';
import { CheckCircle2, FileText, PlusCircle } from 'lucide-react';
import styles from './ActivityFeed.module.css';

const IconMap = {
  approved: CheckCircle2,
  new_story: FileText,
  new_use_case: PlusCircle
};

const ActivityFeed = ({ activities = [] }) => {
  return (
    <div className={styles.feed}>
      {activities.map((activity, index) => {
        const Icon = IconMap[activity.type] || FileText;
        return (
          <div key={index} className={styles.item}>
            <div className={styles.iconWrapper}>
              <Icon size={16} className={styles.icon} />
            </div>
            <div className={styles.content}>
              <p className={styles.description}>{activity.description}</p>
              <p className={styles.meta}>
                {activity.timeAgo} &bull; {activity.author}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
