import React from 'react';
import {
  Clock,
  Star,
  LayoutGrid,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Menu,
  SlidersHorizontal,
  LayoutDashboard,
  Boxes,
  Users,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import { ForYouIcon, SpacesSidebarIcon, CollectITIcon } from './Icons';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.navSection}>
        {/* For you (Selected/Active) */}
        <button className={`${styles.navItem} ${styles.activeItem}`}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>
              <ForYouIcon size={18} color="#0c66e4" />
            </span>
            <span className={styles.navLabel}>For you</span>
          </div>
        </button>

        {/* Recent */}
        <button className={styles.navItem}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>
              <Clock size={18} />
            </span>
            <span className={styles.navLabel}>Recent</span>
          </div>
          <ChevronRight size={16} className={styles.rightIcon} />
        </button>

        {/* Starred */}
        <button className={styles.navItem}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>
              <Star size={18} />
            </span>
            <span className={styles.navLabel}>Starred</span>
          </div>
          <ChevronRight size={16} className={styles.rightIcon} />
        </button>

        {/* Apps */}
        <button className={styles.navItem}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>
              <LayoutGrid size={18} />
            </span>
            <span className={styles.navLabel}>Apps</span>
          </div>
        </button>

        {/* Spaces */}
        <div className={styles.navItem} style={{ cursor: 'pointer' }}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>
              <SpacesSidebarIcon size={18} />
            </span>
            <span className={styles.navLabel} style={{ fontWeight: 600 }}>
              Spaces
            </span>
          </div>
          <div className={styles.spacesActions}>
            <button className={styles.subActionBtn} title="Create space">
              <Plus size={15} />
            </button>
            <button className={styles.subActionBtn} title="More actions">
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Spaces explanation text */}
        <div className={styles.spacesHelpText}>
          Once you visit or create spaces, they'll show up here.
        </div>

        {/* More spaces */}
        <button className={styles.navItem}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>
              <Menu size={18} />
            </span>
            <span className={styles.navLabel}>More spaces</span>
          </div>
          <ChevronRight size={16} className={styles.rightIcon} />
        </button>

        {/* Recommended Header */}
        <div className={styles.sectionHeader}>Recommended</div>

        {/* Collect IT requests */}
        <button className={styles.navItem}>
          <div className={styles.itemLeft}>
            <CollectITIcon />
            <span className={styles.navLabel}>Collect IT requests</span>
          </div>
          <span className={styles.tryBadge}>Try</span>
        </button>

        {/* Filters */}
        <button className={styles.navItem}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>
              <SlidersHorizontal size={18} />
            </span>
            <span className={styles.navLabel}>Filters</span>
          </div>
        </button>

        {/* Dashboards */}
        <button className={styles.navItem}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>
              <LayoutDashboard size={18} />
            </span>
            <span className={styles.navLabel}>Dashboards</span>
          </div>
        </button>

        {/* Assets */}
        <button className={styles.navItem}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>
              <Boxes size={18} />
            </span>
            <span className={styles.navLabel}>Assets</span>
          </div>
          <span className={styles.tryBadge}>Try</span>
        </button>

        {/* Teams */}
        <button className={styles.navItem}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>
              <Users size={18} />
            </span>
            <span className={styles.navLabel}>Teams</span>
          </div>
          <ExternalLink size={14} className={styles.rightIcon} />
        </button>
      </div>

      {/* Customize sidebar at bottom */}
      <div className={styles.bottomSection}>
        <button className={styles.customizeBtn}>
          <Sliders size={17} />
          <span>Customize sidebar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
