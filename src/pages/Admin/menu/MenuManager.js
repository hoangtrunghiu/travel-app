import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, Popconfirm, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SearchTable from '@/utils/searchTable';
import menuApi from '@/api/menuApi';
import { deleteMenu } from '@/services/menuService';
import MenuForm from '@/components/Admin/menu/MenuForm';
import { useNotify } from '@/utils/notify';

export default function MenuManager() {
   const { getColumnSearchProps } = SearchTable();
   const [menus, setMenus] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingMenu, setEditingMenu] = useState(null); // Lưu menu đang chỉnh sửa
   const { notifySuccess, contextHolder } = useNotify();

   useEffect(() => {
      fetchAllMenus();
   }, []);

   const fetchAllMenus = async () => {
      try {
         const response = await menuApi.getMenuHierarchy();
         if (response?.data?.length) {
            setMenus(response.data);
         }
      } catch (error) {
         console.error('Lỗi khi lấy menu:', error);
      }
   };

   const handleDeleteMenu = async (data) => {
      await deleteMenu(data.Id);
      notifySuccess('Xóa thành công', `Menu "${data.MenuName}" đã được xóa.`);
      fetchAllMenus();
   };

   const handleEditMenu = (menu) => {
      setEditingMenu(menu); // Lưu menu cần chỉnh sửa
      setIsModalOpen(true);
   };

   const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingMenu(null);
   };

   const columns = [
      {
         title: 'Tên Menu',
         dataIndex: 'DisplayName',
         key: 'DisplayName',
         ...getColumnSearchProps('DisplayName'),
      },
      {
         title: 'URL',
         dataIndex: 'MenuUrl',
         key: 'MenuUrl',
      },
      {
         title: 'Thứ tự',
         dataIndex: 'SortOrder',
         key: 'SortOrder',
         sorter: (a, b) => a.SortOrder - b.SortOrder,
      },
      {
         title: 'Trạng thái',
         dataIndex: 'IsHide',
         key: 'IsHide',
         render: (isHide) => (isHide ? 'Ẩn' : 'Hiện'),
      },
      {
         title: 'Hành động',
         key: 'actions',
         render: (text, record) => (
            <Space>
               <Button type="link" onClick={() => handleEditMenu(record)}>
                  <EditOutlined /> Sửa
               </Button>
               <Popconfirm
                  title="Bạn có chắc muốn xóa menu này?"
                  onConfirm={() => handleDeleteMenu(record)}
                  okText="Có"
                  cancelText="Không"
               >
                  <Button type="link" danger>
                     <DeleteOutlined />
                     Xóa
                  </Button>
               </Popconfirm>
            </Space>
         ),
      },
   ];

   return (
      <>
         {contextHolder}
         <Card
            className="header-solid mb-24"
            title={<h6 className="font-semibold text-lg md:text-xl">Danh sách menu</h6>}
            extra={
               <Button type="primary" onClick={() => setIsModalOpen(true)}>
                  Thêm mới
               </Button>
            }
         >
            <Table
               dataSource={menus}
               columns={columns}
               rowKey="Id"
               pagination={{ pageSize: 20 }}
               scroll={{ x: 'max-content' }}
            />
         </Card>
         {/* Modal hiển thị form thêm/sửa menu */}
         <Modal width="800px" open={isModalOpen} footer={null} onCancel={handleCloseModal}>
            <MenuForm
               menu={editingMenu} // Truyền menu đang chỉnh sửa
               onSuccess={fetchAllMenus}
               onClose={handleCloseModal}
            />
         </Modal>
      </>
   );
}
