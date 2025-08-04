import React from 'react';
import ReactModal from 'react-modal';
import styles from '@/styles/modules/location-select-modal.module.scss';
import gridStyles from '@/styles/modules/grid.module.scss';
import gutterStyles from '@/styles/modules/gutter.module.scss';

interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * LocationSelectModal: 位置選択用モーダルコンポーネント
 *
 * react-modalを使用した位置選択専用のモーダル表示コンポーネントです。
 * 2つの選択肢を上下に配置し、スマートフォン表示に最適化された設計です。
 *
 * - 2つの位置選択ボタン（aタグ）を上下配置
 * - PhotoModalを参考にしたナビゲーション構造
 * - シンプルでミニマルなデザイン
 *
 * @param isOpen モーダルの表示状態
 * @param onClose モーダルを閉じる関数
 *
 * @example
 * // 基本的な使用例
 * const [isOpen, setIsOpen] = useState(false);
 * <LocationSelectModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * />
 *
 * @example
 * // フッターボタンと組み合わせた使用
 * <button onClick={() => setIsOpen(true)}>施設選択</button>
 * <LocationSelectModal
 *   isOpen={isModalOpen}
 *   onClose={closeModal}
 * />
 *
 * @remarks
 * - react-modalライブラリが必要です
 * - location-select-modal.module.scssスタイルを使用
 * - グローバルクラス location-select-modal__overlay を使用
 * - PhotoModalのナビゲーション構造を参考
 */
const LocationSelectModal: React.FC<LocationSelectModalProps> = ({ isOpen, onClose }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      contentLabel="Location Select Modal"
      overlayClassName={{
        base: 'location-select-modal__overlay',
        afterOpen: 'location-select-modal__overlay--after-open',
        beforeClose: 'location-select-modal__overlay--before-close',
      }}
      className="location-select-modal__content"
      bodyOpenClassName="location-select-modal__body--open"
    >
      <div className={styles['modal--container']}>
        {/* メインコンテンツ部分 */}
        <div className={`${gridStyles['row--container']}  ${gutterStyles.container} ${styles['content--container']}`}>
          <a
            href="#"
            className={`${styles['location--button']} ignore`}
          >
            施設A
          </a>
          <a
            href="#"
            className={`${styles['location--button']} ignore`}
          >
            施設B
          </a>
        </div>

        {/* ナビゲーション部分（PhotoModalのナビゲーション構造を参考） */}
        <div className={`${gridStyles['row--container']} ${gutterStyles.container} ${styles['navigation--container']}`}>
          <div className={styles['navigation--columns']}>
            <button
              className={styles['nav-close--button']}
              onClick={onClose}
              type="button"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </ReactModal>
  );
};

export default LocationSelectModal;