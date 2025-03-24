import React from 'react';
import { Modal, Input } from 'antd';

const NewFolderModal = ({ visible, onCancel, onOk, folderName, setFolderName }) => {
   return (
      <Modal title="Tạo thư mục mới" open={visible} onOk={onOk} onCancel={onCancel}>
         <div className="py-4">
            <p className="mb-2">Tạo thư mục mới nằm trong thư mục gốc</p>
            <Input
               className="w-full"
               placeholder="Nhập tên thư mục"
               value={folderName}
               onChange={(e) => setFolderName(e.target.value)}
               onPressEnter={onOk}
            />
         </div>
      </Modal>
   );
};

export default NewFolderModal;
