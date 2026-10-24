import React, { useState } from 'react';
import { Search, Plus, Bell, Settings, Gem } from 'lucide-react';
import { SidebarToggleIcon, AppSwitcherIcon, JiraLogo } from './Icons';
import { useAI } from '../context/AIContext';
import styles from './TopNavbar.module.css';

const TopNavbar = () => {
  const [searchValue, setSearchValue] = useState('');
  const { submitQuestion, handleUpgradeFallback } = useAI();

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const question = searchValue.trim();
      if (!question) return;
      await submitQuestion(question);
    }
  };

  return (
    <header className={styles.navbar}>
      {/* Left side: [sidebar/menu icon] [apps/grid icon] [Jira logo] Jira */}
      <div className={styles.leftSection}>
        <button className={styles.iconBtn} title="Toggle sidebar" aria-label="Toggle sidebar">
          <SidebarToggleIcon size={18} />
        </button>
        <button className={styles.iconBtn} title="App switcher" aria-label="App switcher">
          <AppSwitcherIcon size={18} />
        </button>
        <div className={styles.logoContainer} title="Jira Home">
          <JiraLogo size={24} />
          <span className={styles.logoText}>Jira</span>
        </div>
      </div>

      {/* Center: Wide Search input (approx 780px) */}
      <div className={styles.centerSection}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            id="top-nav-search"
            name="search"
            type="text"
            className={styles.searchInput}
            placeholder="Search"
            aria-label="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Right side: Action buttons, bell, settings, avatar */}
      <div className={styles.rightSection}>
        <button className={styles.createBtn}>
          <Plus size={16} strokeWidth={2.5} />
          <span>Create</span>
        </button>

        <button
          className={styles.upgradeBtn}
          onClick={handleUpgradeFallback}
          type="button"
          title="Upgrade"
        >
          <Gem size={15} color="#6554c0" />
          <span>Upgrade</span>
        </button>

        <div className={styles.bellContainer}>
          <button className={styles.iconBtn} title="Notifications" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <span className={styles.badge}>3+</span>
        </div>

        <button className={styles.iconBtn} title="Settings" aria-label="Settings">
          <Settings size={18} />
        </button>

        <div className={styles.avatar} title="Oswaldo (OG)">
          OG
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
