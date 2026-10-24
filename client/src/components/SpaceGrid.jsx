import React from 'react';
import SpaceCard from './SpaceCard';
import styles from './SpaceGrid.module.css';

const SpaceGrid = ({ spaces }) => {
  return (
    <div className={styles.grid}>
      {spaces.map((space) => (
        <SpaceCard
          key={space.id || space.title}
          title={space.title}
          subtitle={space.subtitle}
          iconType={space.iconType}
          members={space.members}
        />
      ))}
    </div>
  );
};

export default SpaceGrid;
