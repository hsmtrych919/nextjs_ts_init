import React, { useState } from 'react';
import gridStyles from '@/styles/modules/grid.module.scss';
import gutterStyles from '@/styles/modules/gutter.module.scss';
import galleryStyles from '@/styles/modules/gallery.module.scss';

export type TabId = 'exterior' | 'interior' | 'common';

interface GalleryLayoutProps {
  children?: React.ReactNode;
  activeTab?: TabId;
  onTabChange?: (tabId: TabId) => void;
}

const GalleryLayout: React.FC<GalleryLayoutProps> = ({ children, activeTab: propActiveTab, onTabChange }) => {
  const [internalActiveTab, setInternalActiveTab] = useState<TabId>('exterior');

  // propsでactiveTabが渡された場合はそれを使用、そうでなければ内部状態を使用
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalActiveTab;

  const tabs = [
    { id: 'exterior' as TabId, label: '外観' },
    { id: 'interior' as TabId, label: '居室' },
    { id: 'common' as TabId, label: '共用部' }
  ];

  const handleTabClick = (tabId: TabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  return (
    <div className={galleryStyles.galleryContainer}>
      {/* サイトタイトル */}
      <header className={galleryStyles.header}>
        <h1 className={galleryStyles.title}>写真ギャラリー</h1>
      </header>

      {/* タブナビゲーション */}
      <nav className={galleryStyles.tabNavigation}>
        <div className={galleryStyles.tabContainer}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${galleryStyles.tabButton} ${activeTab === tab.id ? galleryStyles.active : ''}`}
              onClick={() => handleTabClick(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* コンテンツエリア */}
      <main className={`${gridStyles['row--container']} ${gutterStyles.container} ${galleryStyles['grid-container']}`}>
        <div className={`${gridStyles['col--12']}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default GalleryLayout;