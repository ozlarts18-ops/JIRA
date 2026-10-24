import React from 'react';
import { Search } from 'lucide-react';
import { useAI } from '../context/AIContext';
import styles from './SpaceSearch.module.css';

const SpaceSearch = ({ searchValue, onSearchChange }) => {
  const { submitCodeFinder } = useAI();

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const question = searchValue.trim();
      if (!question) return;
      await submitCodeFinder(question);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Find a space</h2>
        <span className={styles.viewAllLink}>View all spaces</span>
      </div>
      <div className={styles.searchWrapper}>
        <Search size={17} className={styles.searchIcon} />
        <input
          id="space-search-input"
          name="spaceSearch"
          type="text"
          className={styles.searchInput}
          placeholder="Find spaces by searching for teammates, teams, or space names"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default SpaceSearch;
