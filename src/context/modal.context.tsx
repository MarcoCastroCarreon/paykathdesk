import { Modal } from 'antd';
import { ReactElement, createContext, useState } from 'react';

type SetModalTitleFn = (title: string) => any;
type OpenModalFn = () => void;
type SetContentFn = (component: ReactElement) => any;
type OkModalFn = (fn: any) => void;

type ModalContextType = {
  setModalTitle: SetModalTitleFn;
  openModal?: OpenModalFn;
  setModalContent?: SetContentFn;
  onClose?: () => any;
  onOk?: OkModalFn;
  modalOpen?: boolean;
  setWidth: (value: any) => any;
  setCancelText: (value: string) => any;
  setOkText: (value: string) => any;
  setConfirmLoading: (value: boolean) => any;
  confirmLoading: boolean
};

export const ModalContext = createContext<ModalContextType>({
  setModalTitle: () => {},
  setWidth: () => {},
  setCancelText: () => {},
  setOkText: () => {},
  setConfirmLoading: () => {},
  confirmLoading: false
});

const ModalProvider = ({ children }: any) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('Modal');
  const [content, setContent] = useState<ReactElement>(<></>);
  const [width, setWidth] = useState<number>();
  const [cancelText, setCancelText] = useState<string>('');
  const [okText, setOkText] = useState<string>('');
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const onClose = () => {
    setModalOpen(false);
  };

  const onOpen = () => {
    setModalOpen(true);
  };

  const onOk = async () => {
    setConfirmLoading(true);
  };

  return (
    <ModalContext.Provider
      value={{
        setModalTitle: setTitle,
        openModal: onOpen,
        setModalContent: setContent,
        onClose,
        onOk,
        modalOpen,
        setWidth,
        setCancelText,
        setOkText,
        setConfirmLoading,
        confirmLoading,
      }}>
      <Modal
        title={title}
        onCancel={onClose}
        closable
        onOk={onOk}
        closeIcon={null}
        open={modalOpen}
        width={width}
        cancelText={cancelText}
        okText={okText}
        confirmLoading={confirmLoading}>
        {content}
      </Modal>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
