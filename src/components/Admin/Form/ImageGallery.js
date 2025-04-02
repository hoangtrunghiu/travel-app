//Component chọn hình bộ sưu tập hình ảnh gắn vào form
import React, { useState } from 'react';
import { Button, Image, Card, Space } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import FileManagerModal from '@/components/Admin/FileManager/FileManagerModal';

const ImageGallery = ({ value = [], onChange }) => {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const handleOpenModal = () => setIsModalOpen(true);
   const handleCloseModal = () => setIsModalOpen(false);

   // Xử lý chọn ảnh từ FileManager
   const handleFileInsert = (file) => {
      const newImage = file.url;

      onChange((prev) => {
         // Kiểm tra ảnh đã tồn tại chưa, nếu chưa mới thêm
         if (!prev.includes(newImage)) {
            const updatedImages = [...prev, newImage];
            return updatedImages;
         }
         return prev; // Nếu đã tồn tại, không thay đổi state
      });

      handleCloseModal();
   };

   // Xóa ảnh khỏi danh sách
   const handleRemoveImage = (url) => {
      const updatedImages = value.filter((item) => item !== url);
      onChange(updatedImages);
   };

   return (
      <>
         <div className="flex flex-wrap gap-3">
            {value.map((imgUrl, index) => (
               <Card
                  key={index}
                  hoverable
                  cover={
                     <Image
                        width={148}
                        height={148}
                        src={process.env.REACT_APP_TRAVEL_BASE_URL_ROOT + imgUrl}
                        alt={`Ảnh ${index + 1}`}
                        style={{ borderRadius: 8 }}
                     />
                  }
                  actions={[<DeleteOutlined key="delete" onClick={() => handleRemoveImage(imgUrl)} />]}
               />
            ))}
         </div>

         <Space className="mt-3">
            <Button icon={<UploadOutlined />} onClick={handleOpenModal}>
               Chọn hình
            </Button>
         </Space>

         <FileManagerModal isOpen={isModalOpen} onClose={handleCloseModal} onInsertFile={handleFileInsert} />
      </>
   );
};

export default ImageGallery;
