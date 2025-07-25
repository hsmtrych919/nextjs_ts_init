import React, { useState, ReactNode } from 'react';
import ModalComponent from '@/components/ui/modal/component';
import styles from '@/styles/modules/button.module.scss';

interface ModalProps {
  children?: ReactNode;
}

/**
 * SimpleModalDemo: モーダル表示機能付きデモコンポーネント
 *
 * ボタンクリックでモーダルを開き、カスタムコンテンツまたはデフォルトコンテンツを表示します。
 * react-modalライブラリを使用した基本的なモーダル実装のデモンストレーション用です。
 *
 * - ボタンクリックでモーダル開閉
 * - カスタムchildren対応
 * - デフォルトコンテンツ提供
 *
 * @param children モーダル内に表示するカスタムコンテンツ（省略時はデフォルトコンテンツを表示）
 *
 * @example
 * // 基本的な使用例（デフォルトコンテンツ）
 * <SimpleModalDemo />
 *
 * @example
 * // カスタムコンテンツを指定
 * <SimpleModalDemo>
 *   <h2>カスタムタイトル</h2>
 *   <p>カスタムコンテンツです</p>
 * </SimpleModalDemo>
 *
 * @remarks
 * - react-modalライブラリが必要です
 * - button.module.scssスタイルを使用
 * - ModalComponentと組み合わせて動作
 */
export default function SimpleModalDemo({ children }: ModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className={styles.button}>
        モーダル展開
      </button>

      <ModalComponent
        isOpen={isModalOpen}
        closeModal={closeModal}
      >
        {children || (
          <div>
            <h2>モーダルタイトル</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          </div>
        )}
      </ModalComponent>
    </div>
  );
}

