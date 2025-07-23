import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';

interface ModalComponentProps {
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
}

/**
 * ModalComponent: React Modalの基底コンポーネント
 *
 * react-modalライブラリをラップした再利用可能なモーダルコンポーネントです。
 * 統一されたスタイルクラスとオプション設定で、一貫したモーダル体験を提供します。
 *
 * - ESCキーとオーバーレイクリックで閉じる
 * - カスタムスタイルクラス適用
 * - 標準的な「閉じる」ボタン付き
 *
 * @param isOpen モーダルの表示状態
 * @param closeModal モーダルを閉じる関数
 * @param children モーダル内に表示するコンテンツ
 *
 * @example
 * // このコンポーネントは状態を持たないため、useStateと組み合わせて使用します。
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <ModalComponent
 *   isOpen={isOpen}
 *   closeModal={() => setIsOpen(false)}
 * >
 *   モーダルコンテンツ
 * </ModalComponent>
 *
 * <button onClick={() => setIsOpen(true)}>モーダルを開く</button>
 *
 * @remarks
 * - react-modalライブラリが必要です
 * - CSSクラス「reactmodal__overlay」「reactmodal__item--container」などを使用
 * - アクセシビリティ対応（contentLabel設定）
 */
const ModalComponent = ({ isOpen, closeModal, children }: ModalComponentProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={closeModal}
      shouldCloseOnEsc={true}
      shouldCloseOnOverlayClick={true}
      contentLabel="item Modal"
      overlayClassName={{
        base: 'reactmodal__overlay',
        afterOpen: 'reactmodal__overlay--after-open',
        beforeClose: 'reactmodal__overlay--before-close',
      }}
      className="reactmodal__item--container"
      bodyOpenClassName="reactmodal__body--open"
    >
      {children}
      <button onClick={closeModal} className='reactmodal__items--close'>閉じる</button>
    </ReactModal>
  );
};

export default ModalComponent;
