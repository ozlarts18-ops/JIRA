import React from 'react';
import { Pract7Icon, Pract6Icon, SmartBuildingIcon } from './Icons';
import styles from './SpaceCard.module.css';

const avatarColors = {
  KB: '#5243aa', // Purple
  BG: '#1f845a', // Green
  PE: '#091e42', // Navy
  VD: '#e56910', // Orange
  A: '#00a3bf',  // Teal
};

const renderIcon = (type) => {
  switch (type) {
    case 'flask':
      return <Pract7Icon />;
    case 'robot':
      return <Pract6Icon />;
    case 'building':
      return <SmartBuildingIcon />;
    default:
      return <Pract7Icon />;
  }
};

const SpaceCard = ({ title, subtitle, iconType, members = ['KB', 'BG', 'PE', 'VD', 'A'] }) => {
  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <div className={styles.iconWrapper}>
          {renderIcon(iconType)}
        </div>
        <div className={styles.avatarStack}>
          {members.map((member, index) => (
            <div
              key={index}
              className={styles.avatar}
              style={{ backgroundColor: avatarColors[member] || '#626f86', zIndex: 10 - index }}
              title={member}
            >
              {member}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.contentRow}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>
    </div>
  );
};

export default SpaceCard;
