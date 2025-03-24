import React, { useState, useEffect } from 'react';
import { Button, Input, Breadcrumb, Spin, Empty, Popconfirm, Select, Drawer, Form, Tooltip, message } from 'antd';
import {
   HomeOutlined,
   UploadOutlined,
   DeleteOutlined,
   DownloadOutlined,
   InsertRowBelowOutlined,
   PictureOutlined,
   EditOutlined,
   FileImageOutlined,
} from '@ant-design/icons';
import axiosClient from '@/api/axiosClient';
import { useNotify } from '@/utils/notify'; //thông báo

const { Search } = Input;
const { Option } = Select;

const LibrarySection = ({
   API_ENDPOINTS,
   currentFolder,
   folderPath,
   handleBackToRoot,
   handleBreadcrumbClick,
   handleOpenFolder,
   handleSearch,
   handleDeleteFile,
   handleSelectFile,
   handleInsertFile,
   getFileIcon,
   isImage,
   filteredFiles,
   loading,
   searchQuery,
   setSearchQuery,
   setCurrentMenu,
   folders,
}) => {
   const BASE_URL = process.env.REACT_APP_TRAVEL_BASE_URL_ROOT;
   const [selectedFile, setSelectedFile] = useState(null);
   const [sidebarVisible, setSidebarVisible] = useState(false);
   const [selectedFolder, setSelectedFolder] = useState(currentFolder?.id || null);
   const [insertType, setInsertType] = useState('avatar'); // avatar, gallery, editor
   const [form] = Form.useForm();
   const { notifySuccess, notifyError, contextHolder } = useNotify(); //thông báo

   // Update selectedFolder when currentFolder changes
   useEffect(() => {
      setSelectedFolder(currentFolder?.id || null);
   }, [currentFolder]);

   // Handle folder change from select dropdown
   const handleFolderChange = (folderId) => {
      const folder = folders.find((f) => f.id === folderId) || null;
      handleOpenFolder(folder);
   };

   // Handle file click to show sidebar
   const handleFileClick = (file) => {
      setSelectedFile(file);
      setSidebarVisible(true);

      // Pre-populate form with file's current folder
      form.setFieldsValue({
         parentFolder: file.folderId || null,
         insertType: 'avatar',
      });
   };

   // Close sidebar
   const closeSidebar = () => {
      setSidebarVisible(false);
      setSelectedFile(null);
   };

   // Handle file insert based on type
   const handleFileInsertByType = () => {
      if (!selectedFile) return;
      console.log('Insert type:', insertType);
      console.log(selectedFile);
      switch (insertType) {
         case 'avatar':
            handleSelectFile(selectedFile); // For avatar selection
            break;
         case 'gallery':
            // Handle gallery insert (you may need to implement this function)
            message.success('Đã thêm vào bộ sưu tập');
            break;
         case 'editor':
            handleInsertFile(selectedFile); // For editor insert
            break;
         default:
            handleSelectFile(selectedFile);
      }

      closeSidebar();
   };

   // Handle change folder for the selected file
   const handleChangeFileFolder = async () => {
      if (!selectedFile) return;

      try {
         const values = await form.validateFields();
         const { parentFolder } = values;
         // Call API to update file's folder
         await axiosClient.put(`/files/${selectedFile.id}?folderId=${parentFolder}`);

         notifySuccess(`Đã chuyển file "${selectedFile.name}" sang thư mục mới`);
         // Reload data
         handleBackToRoot();
         if (parentFolder) {
            const newFolder = folders.find((f) => f.id === parentFolder);
            handleOpenFolder(newFolder);
         }

         closeSidebar();
      } catch (error) {
         console.error('Lỗi khi cập nhật thư mục:', error);
         notifyError('Lỗi khi cập nhật thư mục', 'Không thể cập nhật thư mục cho file');
      }
   };

   return (
      <div className="library-container">
         {contextHolder}
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Thư viện file</h2>
            <div className="flex gap-2">
               <Search
                  placeholder="Tìm kiếm file..."
                  onSearch={handleSearch}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: 200, height: 20 }}
                  value={searchQuery}
               />

               {/* Folder select dropdown */}
               <Select
                  placeholder="Chọn thư mục"
                  style={{ width: 200 }}
                  value={selectedFolder}
                  onChange={handleFolderChange}
                  allowClear
                  onClear={() => handleBackToRoot()}
               >
                  <Select.Option value={null}>Tất cả thư mục</Select.Option>
                  {folders.map((folder) => (
                     <Option key={folder.id} value={folder.id}>
                        {folder.name}
                     </Option>
                  ))}
               </Select>

               <Button type="primary" icon={<UploadOutlined />} onClick={() => setCurrentMenu('upload')}>
                  Tải lên
               </Button>
            </div>
         </div>

         {/* Breadcrumb navigation */}
         {(currentFolder || folderPath.length > 0) && (
            <Breadcrumb className="mb-4">
               <Breadcrumb.Item onClick={handleBackToRoot} className="cursor-pointer">
                  <HomeOutlined /> Trang chủ
               </Breadcrumb.Item>
               {folderPath.map((folder) => (
                  <Breadcrumb.Item
                     key={folder.id}
                     onClick={() => handleBreadcrumbClick(folder)}
                     className="cursor-pointer"
                  >
                     {folder.name}
                  </Breadcrumb.Item>
               ))}
            </Breadcrumb>
         )}

         <Spin spinning={loading}>
            {/* Files section */}
            <div className="mb-4">
               {filteredFiles.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2">
                     {filteredFiles.map((file) => (
                        <div
                           key={file.id}
                           className={`file-item p-2 border rounded-lg shadow-sm cursor-pointer bg-white ${
                              selectedFile?.id === file.id ? 'border-blue-500 border-2' : ''
                           }`}
                           onClick={() => handleFileClick(file)}
                        >
                           {isImage(file) ? (
                              <div className="h-40 overflow-hidden flex items-center justify-center bg-gray-100">
                                 <img alt={file.name} src={BASE_URL + file.url} className="max-h-full object-contain" />
                              </div>
                           ) : (
                              <div className="h-40 flex items-center justify-center bg-gray-100">
                                 <div className="text-center">
                                    {getFileIcon(file)}
                                    <p className="mt-2 text-sm font-medium">
                                       {file.name.split('.').pop().toUpperCase()}
                                    </p>
                                 </div>
                              </div>
                           )}

                           <div className="text-center mt-2 text-sm truncate">
                              <Tooltip title={file.name}>{file.name}</Tooltip>
                           </div>
                           <div className="text-xs text-gray-500 text-center">{(file.size / 1024).toFixed(2)} KB</div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <Empty description="Không có file nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
               )}
            </div>
         </Spin>

         {/* File Detail Sidebar */}
         <Drawer
            title="Thông tin file"
            placement="right"
            onClose={closeSidebar}
            open={sidebarVisible}
            width={300}
            footer={
               <div className="flex justify-end space-x-2">
                  <Button onClick={closeSidebar}>Đóng</Button>
                  <Button type="primary" onClick={handleFileInsertByType}>
                     Chèn file
                  </Button>
               </div>
            }
         >
            {selectedFile && (
               <div className="file-detail-sidebar">
                  <div className="mb-4 text-center">
                     {isImage(selectedFile) ? (
                        <div className="mb-4">
                           <img
                              alt={selectedFile.name}
                              src={BASE_URL + selectedFile.url}
                              className="max-w-full h-auto max-h-64 mx-auto"
                           />
                        </div>
                     ) : (
                        <div className="mb-4 text-center text-6xl">{getFileIcon(selectedFile)}</div>
                     )}
                  </div>

                  <div className="file-info mb-6">
                     <h3 className="font-semibold text-lg mb-2">{selectedFile.name}</h3>
                     <p className="text-gray-500">Kích thước: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                     <p className="text-gray-500">Ngày tạo: {new Date(selectedFile.createdAt).toLocaleDateString()}</p>
                     <p className="text-gray-500">Loại file: {selectedFile.name.split('.').pop().toUpperCase()}</p>
                  </div>

                  <Form form={form} layout="vertical">
                     <Form.Item name="parentFolder" label="Thư mục">
                        <Select placeholder="Chọn thư mục" allowClear>
                           {folders.map((folder) => (
                              <Option key={folder.id} value={folder.id}>
                                 {folder.name}
                              </Option>
                           ))}
                        </Select>
                     </Form.Item>

                     <Form.Item>
                        <Button type="default" icon={<EditOutlined />} onClick={handleChangeFileFolder} block>
                           Cập nhật thư mục
                        </Button>
                     </Form.Item>

                     <Form.Item name="insertType" label="Chèn vào">
                        <Select defaultValue="avatar" onChange={(value) => setInsertType(value)}>
                           <Option value="avatar">
                              <PictureOutlined /> Ảnh đại diện
                           </Option>
                           <Option value="gallery">
                              <FileImageOutlined /> Bộ sưu tập
                           </Option>
                           <Option value="editor">
                              <InsertRowBelowOutlined /> Editor
                           </Option>
                        </Select>
                     </Form.Item>
                  </Form>

                  <Popconfirm
                     title="Bạn có chắc chắn muốn xóa file này?"
                     onConfirm={() => {
                        handleDeleteFile(selectedFile);
                        closeSidebar();
                     }}
                     okText="Xóa"
                     cancelText="Hủy"
                  >
                     <Button danger icon={<DeleteOutlined />} block>
                        Xóa file
                     </Button>
                  </Popconfirm>

                  <div className="mt-4">
                     <a
                        href={API_ENDPOINTS.downloadFile(selectedFile.id)}
                        download={selectedFile.name}
                        className="block"
                     >
                        <Button icon={<DownloadOutlined />} block>
                           Tải xuống
                        </Button>
                     </a>
                  </div>
               </div>
            )}
         </Drawer>
      </div>
   );
};

export default LibrarySection;
