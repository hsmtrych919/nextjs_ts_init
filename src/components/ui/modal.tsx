import React, { useState, ReactNode } from 'react';
import ModalComponent from '@/components/ui/modal/component';
import styles from '@/styles/modules/button.module.scss';

interface ModalProps {
  children?: ReactNode;
}

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

