import React from 'react';
import gridStyles from '@/styles/modules/grid.module.scss';
import { ImgPath } from '@/lib/utils/rewritePath';
import { GalleryImage, CategoryKey } from '@/lib/utils/galleryData';

interface PhotoGridProps {
  images: GalleryImage[];
  category: CategoryKey;
  onPhotoClick: (image: GalleryImage, index: number) => void;
}

/**
 * PhotoGrid: 写真グリッド表示コンポーネント
 * 
 * gridDemo.tsxのgrid--2パターンを活用した2列グリッドレイアウトで
 * ギャラリー写真のサムネイルを表示します。
 * 
 * @param images - 表示する画像配列
 * @param category - 現在のカテゴリ（デバッグ用）
 * @param onPhotoClick - 写真クリック時のコールバック関数
 */
const PhotoGrid: React.FC<PhotoGridProps> = ({ images, category, onPhotoClick }) => {
  return (
    <div>
      <ul className={`${gridStyles.grid} ${gridStyles['grid--2']}`} style={{ rowGap: 'var(--gutter)' }}>
        {images.map((image, index) => (
          <li key={`${category}-${index}`}>
            <button
              onClick={() => onPhotoClick(image, index)}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '0',
                width: '100%',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '200px',
                  overflow: 'hidden',
                  display: 'block',
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  minWidth: '100%',
                  minHeight: '100%'
                }}>
                  <ImgPath
                    src={image.thumbnail.replace('/img/', '')}
                    alt={image.alt}
                  />
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PhotoGrid;