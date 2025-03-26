import React from 'react';
import { Modal } from 'antd';
import FileManager from './FileManager';

const FileManagerModal = ({ isOpen, onClose, onInsertFile }) => {
   return (
      <Modal title="Chọn file" open={isOpen} onCancel={onClose} footer={null} width={1400}>
         <FileManager
            onInsertFile={(file) => {
               onInsertFile(file); // Gửi file về cha
               onClose(); // Đóng modal
            }}
         />
      </Modal>
   );
};

export default FileManagerModal;
