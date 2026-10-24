import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SpaceSearch from '../components/SpaceSearch';
import SpaceGrid from '../components/SpaceGrid';
import ForYouTabs from '../components/ForYouTabs';
import RecommendationCard from '../components/RecommendationCard';
import styles from './JiraHome.module.css';

const initialSpaces = [
  {
    id: '1',
    title: 'Pract7',
    subtitle: 'Software space',
    iconType: 'flask',
    members: ['KB', 'BG', 'PE', 'VD', 'A'],
  },
  {
    id: '2',
    title: 'pract 6',
    subtitle: 'Software space',
    iconType: 'robot',
    members: ['KB', 'BG', 'PE', 'VD', 'A'],
  },
  {
    id: '3',
    title: 'AI-Based Smart Building Audit and Facility Management System',
    subtitle: 'Software space',
    iconType: 'building',
    members: ['KB', 'BG', 'PE', 'VD', 'A'],
  },
];

const JiraHome = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpaces = initialSpaces.filter((space) =>
    space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.pageLayout}>
      <Sidebar />
      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          {/* Welcome Header */}
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeHeading}>Welcome Oswaldo. It's Saturday, Oct 24.</h1>
            <p className={styles.welcomeSubheading}>Let's find your work in Jira</p>
          </div>

          {/* Find a Space Section */}
          <SpaceSearch
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <SpaceGrid spaces={filteredSpaces} />

          {/* For you Section */}
          <ForYouTabs />
          <RecommendationCard />

          {/* Bottom Area */}
          <div className={styles.bottomFeedback}>
            <MessageSquare size={15} />
            <span>Give us feedback</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JiraHome;
