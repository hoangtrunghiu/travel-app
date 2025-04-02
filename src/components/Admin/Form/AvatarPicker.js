//Component chọn hình đại diện gắn vào form
import React, { useState } from 'react';
import { Button, Image, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import FileManagerModal from '@/components/Admin/FileManager/FileManagerModal';

const AvatarPicker = ({ value, onChange }) => {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const handleOpenModal = () => setIsModalOpen(true);
   const handleCloseModal = () => setIsModalOpen(false);

   const handleFileInsert = (file) => {
      onChange(file.url); // Lưu chỉ URL, không kèm BASE_URL
      handleCloseModal();
   };

   return (
      <>
         <div className="flex flex-col items-center gap-3">
            {value && (
               <Image
                  width={220}
                  src={process.env.REACT_APP_TRAVEL_BASE_URL_ROOT + value}
                  alt="Hình đại diện"
                  style={{ borderRadius: 8, border: '1px solid #ddd', padding: 4 }}
               />
            )}
            <Button icon={<UploadOutlined />} onClick={handleOpenModal}>
               Chọn hình
            </Button>
         </div>

         <FileManagerModal isOpen={isModalOpen} onClose={handleCloseModal} onInsertFile={handleFileInsert} />
      </>
   );
};

export default AvatarPicker;
