import React from 'react';
import styles from './AvatarGroup.module.css';

const AvatarGroup = ({ avatars = [], max = 4, size = 24 }) => {
  const visibleAvatars = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div className={styles.group}>
      {visibleAvatars.map((user, index) => (
        <div 
          key={index} 
          className={styles.avatarWrapper}
          style={{ 
            zIndex: visibleAvatars.length - index,
            width: size,
            height: size
          }}
          title={user.name}
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className={styles.avatar} />
          ) : (
            <div className={styles.fallbackAvatar}>{user.name?.[0]?.toUpperCase() || '?'}</div>
          )}
        </div>
      ))}
      
      {overflow > 0 && (
        <div 
          className={styles.overflowBadge}
          style={{ width: size, height: size }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
