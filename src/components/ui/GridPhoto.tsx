import React from 'react';
import gridStyles from '@/styles/modules/grid.module.scss';
import galleryStyles from '@/styles/modules/gallery.module.scss';
import { ImgPath } from '@/lib/utils/rewritePath';
import { GalleryImage, CategoryKey } from '@/lib/utils/galleryData';

interface GridPhotoProps {
  images: GalleryImage[];
  category: CategoryKey;
  onPhotoClick: (image: GalleryImage, index: number) => void;
  hasOpenedModal: boolean;
}

/**
 * GridPhoto: 写真グリッド表示コンポーネント
 *
 * gridDemo.tsxのgrid--2パターンを活用した2列グリッドレイアウトで
 * ギャラリー写真のサムネイルを表示します。
 *
 * @param images - 表示する画像配列
 * @param category - 現在のカテゴリ（デバッグ用）
 * @param onPhotoClick - 写真クリック時のコールバック関数
 */
const GridPhoto: React.FC<GridPhotoProps> = ({ images, category, onPhotoClick, hasOpenedModal }) => {
  return (
    <>
      <ul className={`${gridStyles.grid} ${gridStyles['grid--2']}  ${gridStyles['grid--sm-4']} ${galleryStyles['grid--container--list']}`} >
        {images.map((image, index) => (
          <li key={`${category}-${index}`}>
            <button
              onClick={() => onPhotoClick(image, index)}
              className={galleryStyles['photo-grid--button']}
            >
              <ImgPath
                src={image.thumbnail}
                alt={image.alt}
                className={galleryStyles['photo-grid--image']}
              />
              {index === 0 && !hasOpenedModal && (
                <span className={galleryStyles['guide--overlay']}>
                  タップして拡大
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default GridPhoto;