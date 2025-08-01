import React, { useState } from 'react';
import styles from '@/styles/modules/gallery.module.scss';
import gridStyles from '@/styles/modules/grid.module.scss';
import gutterStyles from '@/styles/modules/gutter.module.scss';

type TabId = 'exterior' | 'interior' | 'common';

interface GalleryLayoutProps {
  children?: React.ReactNode;
}

const GalleryLayout: React.FC<GalleryLayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabId>('exterior');

  const tabs = [
    { id: 'exterior' as TabId, label: '外観' },
    { id: 'interior' as TabId, label: '居室' },
    { id: 'common' as TabId, label: '共用部' }
  ];

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className={styles.galleryContainer}>
      {/* サイトタイトル */}
      <header className={styles.header}>
        <h1 className={styles.title}>物件写真ギャラリー</h1>
      </header>

      {/* タブナビゲーション */}
      <nav className={styles.tabNavigation}>
        <div className={styles.tabContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => handleTabClick(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* コンテンツエリア */}
      <main className={`${gridStyles['row--container']} ${gutterStyles.container}`}>
        <div className={`${gridStyles['col--12']}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default GalleryLayout;