import React, { useState } from 'react';
import ReactModal from 'react-modal';
import getConfig from 'next/config';
import styles from '@/styles/modules/photo-modal.module.scss';
import gridStyles from '@/styles/modules/grid.module.scss';
import gutterStyles from '@/styles/modules/gutter.module.scss';
import { GalleryImage } from '@/lib/utils/galleryData';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const { publicRuntimeConfig } = getConfig();
const basePath = (publicRuntimeConfig && publicRuntimeConfig.basePath) || '';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

/**
 * PhotoModal: 写真拡大表示用モーダルコンポーネント
 *
 * react-modalを使用した写真専用のモーダル表示コンポーネントです。
 * スワイプナビゲーションとドットインジケーターを備えたスマートフォン特化の設計です。
 *
 * @param isOpen モーダルの表示状態
 * @param onClose モーダルを閉じる関数
 * @param images 表示する画像配列
 * @param currentIndex 現在表示中の画像インデックス
 * @param onNavigate 画像切り替えコールバック関数
 */
const PhotoModal: React.FC<PhotoModalProps> = ({ isOpen, onClose, images, currentIndex, onNavigate }) => {
  const currentImage = images[currentIndex];
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  if (!currentImage) {
    return null;
  }

  // スワイプ検知の最小距離
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < images.length - 1) {
      // 左スワイプ: 次の画像
      onNavigate(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      // 右スワイプ: 前の画像
      onNavigate(currentIndex - 1);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      contentLabel="Photo Modal"
      overlayClassName={{
        base: 'photo-modal__overlay',
        afterOpen: 'photo-modal__overlay--after-open',
        beforeClose: 'photo-modal__overlay--before-close',
      }}
      className="photo-modal__content"
      bodyOpenClassName="photo-modal__body--open"
    >
      <div
        className={styles['modal--container']}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles['image--container']}>

          <img
            src={`${basePath}/img/${currentImage.full}?${Date.now()}`}
            alt={currentImage.alt}
            className={styles['modal--image']}
            />
        {/* ドットインジケーター */}
        <div className={styles['dot--indicators']}>
          {images.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles['dot--active'] : ''}`}
            />
          ))}
        </div>

            </div>


        {/* ナビゲーション機能 */}
        <div className={`${gridStyles['row--container']} ${gutterStyles.container} ${styles['navigation--container']}`}>
          <div className={gridStyles.col} >
            <button className={styles['prev--button']}>
              <ChevronLeftIcon className={styles['nav--icon']} />
              前へ
            </button>
          </div>
          <div className={gridStyles.col} >
            <button className={styles['nav-close--button']}>
              閉じる
            </button>
          </div>
          <div className={gridStyles.col} >
            <button className={styles['next--button']}>
              次へ
              <ChevronRightIcon className={styles['nav--icon']} />
            </button>
          </div>
        </div>

        <div className={styles.controls}>
          <button
            onClick={onClose}
            className={styles['close--button']}
            type="button"
            aria-label="モーダルを閉じる"
          >
            ×
          </button>
        </div>

      </div>
    </ReactModal>
  );
};

export default PhotoModal;