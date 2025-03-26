import React, { useState } from 'react';
import { Button } from 'antd';
import FileManagerModal from './FileManagerModal';

const FilePickerDemo = () => {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedFile, setSelectedFile] = useState(null);
   const BASE_URL = process.env.REACT_APP_TRAVEL_BASE_URL_ROOT;

   const handleOpenModal = () => setIsModalOpen(true);
   const handleCloseModal = () => setIsModalOpen(false);

   const handleFileInsert = (file) => {
      console.log('File nhận được:', file); // Debug
      setSelectedFile(file);
      handleCloseModal();
   };

   return (
      <div>
         <Button onClick={handleOpenModal}>Chọn file</Button>

         {selectedFile && (
            <div>
               <p>File đã chọn: {selectedFile.name}</p>
               <img src={BASE_URL + selectedFile.url} alt={selectedFile.name} style={{ width: 100 }} />
            </div>
         )}

         <FileManagerModal isOpen={isModalOpen} onClose={handleCloseModal} onInsertFile={handleFileInsert} />
      </div>
   );
};

export default FilePickerDemo;
