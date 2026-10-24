import React, { useState } from 'react';
import styles from './ForYouTabs.module.css';

const ForYouTabs = () => {
  const [activeTab, setActiveTab] = useState('Recommended');

  const tabs = [
    { id: 'Recommended', label: 'Recommended' },
    { id: 'Assigned to me', label: 'Assigned to me', badge: '3' },
    { id: 'Starred', label: 'Starred' },
    { id: 'Worked on', label: 'Worked on' },
    { id: 'Viewed', label: 'Viewed' },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>For you</h2>
      <div className={styles.tabList}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`${styles.tab} ${isActive ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              {tab.badge && <span className={styles.badge}>{tab.badge}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ForYouTabs;
