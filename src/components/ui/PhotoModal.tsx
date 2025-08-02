import React from 'react';
import ReactModal from 'react-modal';
import getConfig from 'next/config';
import styles from '@/styles/modules/photo-modal.module.scss';

const { publicRuntimeConfig } = getConfig();
const basePath = (publicRuntimeConfig && publicRuntimeConfig.basePath) || '';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
}

/**
 * PhotoModal: 写真拡大表示用モーダルコンポーネント
 * 
 * react-modalを使用した写真専用のモーダル表示コンポーネントです。
 * 元縦横比を維持しながら写真を拡大表示し、各種操作で閉じることができます。
 * 
 * @param isOpen モーダルの表示状態
 * @param onClose モーダルを閉じる関数
 * @param imageSrc 表示する画像のパス
 * @param imageAlt 画像のalt属性
 * 
 * @example
 * const [isModalOpen, setIsModalOpen] = useState(false);
 * 
 * <PhotoModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   imageSrc="/img/sample.jpg"
 *   imageAlt="サンプル画像"
 * />
 */
const PhotoModal: React.FC<PhotoModalProps> = ({ isOpen, onClose, imageSrc, imageAlt }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      contentLabel="Photo Modal"
      overlayClassName={{
        base: 'photo-modal-overlay',
        afterOpen: 'photo-modal-overlay--after-open',
        beforeClose: 'photo-modal-overlay--before-close',
      }}
      className="photo-modal-content"
      bodyOpenClassName="photo-modal-body--open"
    >
      <div className={styles.modalContainer}>
        <div className={styles.imageContainer}>
          <img
            src={`${basePath}/img/${imageSrc}?${Date.now()}`}
            alt={imageAlt}
            className={styles.modalImage}
          />
        </div>
        
        <div className={styles.controls}>
          <button 
            onClick={onClose} 
            className={styles.closeButton}
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