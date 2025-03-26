import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import axiosClient from '@/api/axiosClient';

const NewFolderModal = ({ visible, onClose, fetchData }) => {
   const [folderName, setFolderName] = useState('');

   // Xử lý tạo thư mục
   const handleCreateFolder = async () => {
      if (!folderName.trim()) {
         console.error('Tên thư mục không được để trống');
         return;
      }

      try {
         await axiosClient.post('/folders', { name: folderName });
         setFolderName(''); // Reset input
         onClose(); // Đóng modal
         fetchData(); // Cập nhật danh sách thư mục
      } catch (error) {
         console.error('Lỗi khi tạo thư mục:', error);
      }
   };

   return (
      <Modal title="Tạo thư mục mới" open={visible} onOk={handleCreateFolder} onCancel={onClose}>
         <Input
            placeholder="Nhập tên thư mục"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onPressEnter={handleCreateFolder}
         />
      </Modal>
   );
};

export default NewFolderModal;
