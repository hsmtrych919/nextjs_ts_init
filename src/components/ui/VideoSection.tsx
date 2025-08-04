import React, { useRef, useCallback } from 'react';
import gridStyles from '@/styles/modules/grid.module.scss';
import gutterStyles from '@/styles/modules/gutter.module.scss';
import galleryStyles from '@/styles/modules/gallery.module.scss';
import { CategoryKey, GalleryData } from '@/lib/utils/galleryData';
import { hasVideoInCategory, getVideoConfigFromGalleryData, getVideoSrc, getVideoThumbnailSrc } from '@/lib/utils/videoPath';

interface VideoSectionProps {
  activeTab: CategoryKey;
  galleryData: GalleryData;
}

/**
 * VideoSection: 動画表示セクションコンポーネント
 *
 * タブに応じて動画を条件付きで表示するコンポーネントです。
 * 動画が存在しないタブでは何も表示せず、DOMに出力されません。
 *
 * @param activeTab - 現在アクティブなカテゴリキー
 * @param galleryData - ギャラリーデータ全体
 */
const VideoSection: React.FC<VideoSectionProps> = ({ activeTab, galleryData }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // フックは常に呼び出す必要があるため、条件分岐の前に配置
  const videoConfig = getVideoConfigFromGalleryData(galleryData, activeTab);
  
  /**
   * 動画エラー時の処理
   */
  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.warn('動画の読み込みに失敗しました:', videoConfig?.src);
    // エラー時はサムネイルのみ表示される
  }, [videoConfig?.src]);

  // 動画が存在しない場合は何も表示しない
  if (!hasVideoInCategory(galleryData, activeTab) || !videoConfig) {
    return null;
  }

  return (
    <div className={`${gridStyles['row--container']} ${gutterStyles.container} mt-3`}>
      <div className={`${gridStyles['col--12']}`}>
        <div className={`embed-responsive embed-responsive-16by9 ${galleryStyles['video--container']}`}>
          <video
            ref={videoRef}
            className={galleryStyles['video--player']}
            controls
            preload="metadata"
            muted
            playsInline
            poster={getVideoThumbnailSrc(videoConfig.thumbnail)}
            src={getVideoSrc(videoConfig.src)}
            onError={handleVideoError}
          >
            <p>お使いのブラウザは動画の再生に対応していません。</p>
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;