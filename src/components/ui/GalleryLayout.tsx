import React, { useState } from 'react';
import gridStyles from '@/styles/modules/grid.module.scss';
import gutterStyles from '@/styles/modules/gutter.module.scss';
import galleryStyles from '@/styles/modules/gallery.module.scss';
import typeStyles from '@/styles/modules/type.module.scss';
import { getGalleryData, getCategoryData, CategoryKey } from '@/lib/utils/galleryData';

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

  // 現在のタブのカテゴリデータを取得
  const galleryData = getGalleryData();
  const currentCategory = getCategoryData(galleryData, activeTab as CategoryKey);

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
    <div className={galleryStyles['gallery--container']}>

      {/* タブナビゲーション */}
      <nav className={galleryStyles['tab--navigation']}>
        <div className={galleryStyles['tab--container']}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${galleryStyles['tab--button']} ${activeTab === tab.id ? galleryStyles.active : ''}`}
              onClick={() => handleTabClick(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* コンテンツエリア */}
      <article >
        <div className={`${gridStyles['row--container']} ${gutterStyles.container} mt-3`}>
          <div className={`${gridStyles['col--12']}`}>
            <div className={galleryStyles.categoryDescription}>
              【ここに動画ファイル配置】
            </div>
          </div>
        </div>
        <div className={`${gridStyles['row--container']} ${gutterStyles.container} mt-3`}>
          <div className={`${gridStyles['col--12']}`}>
            <div className={galleryStyles.categoryDescription}>
              <p className={typeStyles.text}>{currentCategory.description}</p>
            </div>
          </div>
        </div>
        <div className={`${gridStyles['row--container']} ${gutterStyles.container} ${galleryStyles['grid--container']}`}>
          <div className={`${gridStyles['col--12']}`}>
            {children}
          </div>
        </div>
      </article>
    </div>
  );
};

export default GalleryLayout;