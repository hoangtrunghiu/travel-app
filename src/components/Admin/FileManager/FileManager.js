import React, { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import {
   UploadOutlined,
   FileImageOutlined,
   FilePdfOutlined,
   FileWordOutlined,
   FileExcelOutlined,
   FileUnknownOutlined,
   FolderOutlined,
   FileSearchOutlined,
   MenuOutlined,
} from '@ant-design/icons';
import axiosClient from '@/api/axiosClient';
import { useNotify } from '@/utils/notify'; //thông báo

// Component imports
import UploadSection from './UploadSection';
import LibrarySection from './LibrarySection';
import FolderSection from './FolderSection';
import NewFolderModal from './NewFolderModal';

// Base API URL
const API_BASE_URL = 'https://localhost:5001/api';

// API endpoints
const API_ENDPOINTS = {
   files: `${API_BASE_URL}/files`,
   folders: `${API_BASE_URL}/folders`,
   uploadFile: `${API_BASE_URL}/files/upload`,
   downloadFile: (id) => `${API_BASE_URL}/files/download/${id}`,
   filesByFolder: (folderId) => `${API_BASE_URL}/folders/${folderId}/files`,
};

const FileManager = ({ onSelectFile, onInsertFile, isSelectingAvatar = false }) => {
   // State
   const [currentMenu, setCurrentMenu] = useState('upload');
   const [files, setFiles] = useState([]);
   const [folders, setFolders] = useState([]);
   const [currentFolder, setCurrentFolder] = useState(null);
   const [folderPath, setFolderPath] = useState([]);
   const [loading, setLoading] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [newFolderVisible, setNewFolderVisible] = useState(false);
   const [newFolderName, setNewFolderName] = useState('');
   const [uploadedCount, setUploadedCount] = useState(0);
   const [totalToUpload, setTotalToUpload] = useState(0);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const { notifySuccess, notifyError, contextHolder } = useNotify(); //thông báo

   // Fetch data
   const fetchData = useCallback(async () => {
      setLoading(true);
      try {
         // Fetch folders
         const foldersResponse = await axiosClient.get('/folders');
         setFolders(foldersResponse.data);

         // Fetch files
         const filesEndpoint = currentFolder ? `/folders/${currentFolder.id}/files` : '/files';
         const filesResponse = await axiosClient.get(filesEndpoint);
         setFiles(filesResponse.data);

         // Update breadcrumb
         if (currentFolder) {
            buildFolderPath(currentFolder.id, foldersResponse.data);
         } else {
            setFolderPath([]);
         }
      } catch (error) {
         console.error('Lỗi khi tải dữ liệu:', error);
         notifyError('Lỗi khi tải dữ liệu', 'Không thể tải dữ liệu');
      } finally {
         setLoading(false);
      }
   }, [currentFolder]);

   // Initial data loading
   useEffect(() => {
      fetchData();
   }, [fetchData]);

   // Switch menu when upload is complete
   useEffect(() => {
      if (uploadedCount > 0 && uploadedCount === totalToUpload) {
         // Reset counts
         setUploadedCount(0);
         setTotalToUpload(0);

         // Switch to library view
         fetchData();
         setCurrentMenu('library');
      }
   }, [uploadedCount, totalToUpload]);

   // Build folder path for breadcrumb
   const buildFolderPath = (folderId, allFolders) => {
      const path = [];
      let currentId = folderId;

      const findFolder = (id) => {
         const folder = allFolders.find((f) => f.id === id);

         if (folder) {
            path.unshift(folder);
            if (folder.parentId) {
               findFolder(folder.parentId);
            }
         }
      };

      findFolder(currentId);
      setFolderPath(path);
   };

   // Handle file upload
   const handleUpload = async (options, folderId) => {
      const { onSuccess, onError, file, onProgress } = options;

      const formData = new FormData();
      formData.append('file', file);
      if (folderId) {
         formData.append('folderId', folderId);
      }

      try {
         const response = await axiosClient.post('/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (event) => {
               const percent = Math.floor((event.loaded / event.total) * 100);
               onProgress({ percent });
            },
         });

         onSuccess(response.data);
         setUploadedCount((prev) => prev + 1);
         notifySuccess('Tải lên thành công', `${file.name} đã được tải lên thành công.`);
      } catch (error) {
         console.error('Lỗi khi tải lên:', error);
         onError();
         notifyError(`${file.name} tải lên thất bại.`);
      }
   };

   // Handle batch file upload
   const handleBatchUpload = (info) => {
      const { fileList } = info;

      if (info.file.status !== 'uploading' && totalToUpload === 0) {
         setTotalToUpload(fileList.length);
      }

      if (info.file.status === 'done') {
         notifySuccess('Tải lên thành công', `${info.file.name} tải lên thành công`);
      } else if (info.file.status === 'error') {
         notifyError(`${info.file.name} tải lên thất bại.`);
      }
   };

   // Handle file selection for use in editor or as avatar
   const handleSelectFile = (file) => {
      if (onSelectFile) {
         onSelectFile(file);
      }
   };

   // Handle insert file into content
   const handleInsertFile = (file) => {
      if (onInsertFile) {
         onInsertFile(file);
      }
   };

   // Handle file deletion
   const handleDeleteFile = async (file) => {
      try {
         await axiosClient.delete(`/files/${file.id}`);
         notifySuccess(`${file.name} đã được xóa thành công.`);
         fetchData();
      } catch (error) {
         notifyError(`Không thể xóa ${file.name}.`);
         console.error('Lỗi khi xóa file:', error);
      }
   };

   // Handle folder creation
   const handleCreateFolder = async () => {
      if (!newFolderName.trim()) {
         notifyError('Tên thư mục không được để trống');
         return;
      }

      try {
         await axiosClient.post('/folders', {
            name: newFolderName,
         });

         notifySuccess(`Thư mục ${newFolderName} đã được tạo thành công.`);
         setNewFolderName('');
         setNewFolderVisible(false);
         fetchData();
      } catch (error) {
         notifyError('Không thể tạo thư mục mới:');
         console.error('Lỗi khi tạo thư mục:', error);
      }
   };

   // Handle folder navigation
   const handleOpenFolder = (folder) => {
      setCurrentFolder(folder);
   };

   // Handle navigation from breadcrumb
   const handleBreadcrumbClick = (folder) => {
      setCurrentFolder(folder);
   };

   // Handle back to root folder
   const handleBackToRoot = () => {
      setCurrentFolder(null);
   };

   // Handle folder deletion
   const handleDeleteFolder = async (folder) => {
      try {
         await axiosClient.delete(`/folders/${folder.id}`);
         notifySuccess(`Thư mục ${folder.name} đã được xóa thành công.`);
         fetchData();
      } catch (error) {
         if (error.response?.status === 400) {
            notifyError(error.response.data.message);
            console.error('Lỗi khi xóa thư mục:', error);
            // console.log(error.response.data.message);
         } else {
            notifyError(`Không thể xóa thư mục ${folder.name}.`);
            console.error('Lỗi khi xóa thư mục:', error);
         }
      }
   };

   // Handle file search
   const handleSearch = (value) => {
      setSearchQuery(value);
   };

   // Check if file is an image
   const isImage = (file) => {
      const extension = file.name.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension);
   };

   // Get file icon based on file type
   const getFileIcon = (file) => {
      const extension = file.name.split('.').pop().toLowerCase();

      switch (extension) {
         case 'jpg':
         case 'jpeg':
         case 'png':
         case 'gif':
            return <FileImageOutlined className="text-blue-500 text-2xl" />;
         case 'pdf':
            return <FilePdfOutlined className="text-red-500 text-2xl" />;
         case 'doc':
         case 'docx':
            return <FileWordOutlined className="text-blue-700 text-2xl" />;
         case 'xls':
         case 'xlsx':
            return <FileExcelOutlined className="text-green-600 text-2xl" />;
         default:
            return <FileUnknownOutlined className="text-gray-500 text-2xl" />;
      }
   };

   // Filter files by search query
   const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()));

   // Filter folders by search query and parent
   const filteredFolders = folders.filter((folder) => folder.name.toLowerCase().includes(searchQuery.toLowerCase()));

   // Common props for child components
   const commonProps = {
      API_ENDPOINTS,
      currentFolder,
      handleBackToRoot,
      handleOpenFolder,
      handleBreadcrumbClick,
      handleDeleteFolder,
      handleSearch,
      handleDeleteFile,
      handleSelectFile,
      handleInsertFile,
      getFileIcon,
      isImage,
      filteredFiles,
      filteredFolders,
      folderPath,
      searchQuery,
      loading,
      onSelectFile,
      onInsertFile,
      isSelectingAvatar,
      folders,
   };

   // Render content based on selected menu
   const renderContent = () => {
      switch (currentMenu) {
         case 'upload':
            return (
               <UploadSection handleUpload={handleUpload} handleBatchUpload={handleBatchUpload} folders={folders} />
            );
         case 'library':
            return <LibrarySection {...commonProps} setCurrentMenu={setCurrentMenu} setSearchQuery={setSearchQuery} />;
         case 'folders':
            return <FolderSection {...commonProps} setNewFolderVisible={setNewFolderVisible} />;
         default:
            return <LibrarySection {...commonProps} setCurrentMenu={setCurrentMenu} setSearchQuery={setSearchQuery} />;
      }
   };

   return (
      <>
         {contextHolder}
         <div className="file-manager-layout flex flex-col md:flex-row h-screen">
            {/* Mobile Menu Toggle */}
            <button
               className="md:hidden p-2 bg-gray-300 text-black w-full text-left"
               onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
               <MenuOutlined /> Menu
            </button>

            {/* Sidebar Menu */}
            <div
               className={`file-manager-sider bg-gray-200 p-4 w-full md:w-48 ${
                  isMenuOpen ? 'block' : 'hidden'
               } md:block`}
            >
               <ul>
                  <li
                     className={`p-2 cursor-pointer ${currentMenu === 'upload' ? 'bg-gray-300' : ''}`}
                     onClick={() => {
                        setCurrentMenu('upload');
                        setIsMenuOpen(false);
                     }}
                  >
                     <UploadOutlined /> Tải lên file
                  </li>
                  <li
                     className={`p-2 cursor-pointer ${currentMenu === 'library' ? 'bg-gray-300' : ''}`}
                     onClick={() => {
                        setCurrentMenu('library');
                        setIsMenuOpen(false);
                     }}
                  >
                     <FileSearchOutlined /> Thư viện file
                  </li>
                  <li
                     className={`p-2 cursor-pointer ${currentMenu === 'folders' ? 'bg-gray-300' : ''}`}
                     onClick={() => {
                        setCurrentMenu('folders');
                        setIsMenuOpen(false);
                     }}
                  >
                     <FolderOutlined /> Quản lý thư mục
                  </li>
               </ul>
            </div>

            {/* Main Content */}
            <div className="file-manager-content flex-1 p-4 overflow-auto">{renderContent()}</div>

            {/* Modal Tạo thư mục mới */}
            <NewFolderModal
               visible={newFolderVisible}
               onCancel={() => setNewFolderVisible(false)}
               onOk={handleCreateFolder}
               folderName={newFolderName}
               setFolderName={setNewFolderName}
               currentFolder={currentFolder}
            />
         </div>
      </>
   );
};

export default FileManager;
