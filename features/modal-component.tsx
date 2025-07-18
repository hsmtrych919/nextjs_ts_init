import React, { ReactNode } from 'react';
import ReactModal from 'react-modal';


type functionProps ={
  isOpen: boolean;
  closeModal: () => void;
  children: ReactNode;
};


const ModalComponent = ({ isOpen, closeModal, children }: functionProps) => {
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
