import React from 'react';
import { Button, Breadcrumb, Card, Spin, Empty, Popconfirm } from 'antd';
import { HomeOutlined, FolderOutlined, FolderAddOutlined, DeleteOutlined } from '@ant-design/icons';

const FolderSection = ({
   currentFolder,
   folderPath,
   handleBackToRoot,
   handleBreadcrumbClick,
   handleOpenFolder,
   handleDeleteFolder,
   filteredFolders,
   loading,
   setNewFolderVisible,
}) => {
   return (
      <div className="folder-management-container">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quản lý thư mục</h2>
            <Button type="primary" icon={<FolderAddOutlined />} onClick={() => setNewFolderVisible(true)}>
               Tạo thư mục mới
            </Button>
         </div>

         {/* Breadcrumb navigation */}
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

         <Spin spinning={loading}>
            {filteredFolders.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFolders.map((folder) => (
                     <Card key={folder.id} hoverable className="folder-management-card">
                        <div className="flex items-start">
                           <div className="mr-4">
                              <FolderOutlined className="text-yellow-500 text-4xl" />
                           </div>
                           <div className="flex-1">
                              <h3 className="text-lg font-medium">{folder.name}</h3>
                              <p className="text-gray-500 text-sm">
                                 Tạo ngày: {new Date(folder.createdAt).toLocaleDateString()}
                              </p>
                           </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                           <Button type="text" icon={<FolderOutlined />} onClick={() => handleOpenFolder(folder)}>
                              Mở
                           </Button>
                           <Popconfirm
                              title="Bạn có chắc chắn muốn xóa thư mục này?"
                              description="Chỉ có thể xóa thư mục trống."
                              onConfirm={() => handleDeleteFolder(folder)}
                              okText="Xóa"
                              cancelText="Hủy"
                           >
                              <Button type="text" danger icon={<DeleteOutlined />}>
                                 Xóa
                              </Button>
                           </Popconfirm>
                        </div>
                     </Card>
                  ))}
               </div>
            ) : (
               <Empty
                  description={currentFolder ? 'Không có thư mục con nào trong thư mục này' : 'Không có thư mục nào'}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
               />
            )}
         </Spin>
      </div>
   );
};

export default FolderSection;
