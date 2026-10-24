import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ConfluenceLogo } from './Icons';
import styles from './RecommendationCard.module.css';

const RecommendationCard = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={styles.card}>
      <div className={styles.leftGroup}>
        <div className={styles.iconContainer}>
          <ConfluenceLogo size={42} />
        </div>
        <div className={styles.textGroup}>
          <div className={styles.title}>Create and organize docs, all in one place</div>
          <div className={styles.description}>
            With Confluence, you can write docs that are connected to your work in Jira, so work stays in sync.
          </div>
        </div>
      </div>
      <div className={styles.rightGroup}>
        <button className={styles.tryItBtn}>Try it</button>
        <button
          className={styles.closeBtn}
          onClick={() => setVisible(false)}
          title="Dismiss recommendation"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;
