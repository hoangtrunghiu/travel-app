import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, Card, Avatar } from 'antd';
import { deleteCategory, getAllCategoryTours } from '@/services/categoryTourService';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNotify } from '@/utils/notify';
import { flattenCategoryTour } from '@/utils/flattenData';
import SearchTable from '@/utils/searchTable';
import { Link } from 'react-router-dom';

const ListCategoryTour = () => {
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(false);
   const { notifySuccess, notifyError, contextHolder } = useNotify();
   const { getColumnSearchProps } = SearchTable(); //tìm kiếm trên table
   const BASE_URL = process.env.REACT_APP_TRAVEL_BASE_URL_ROOT;

   useEffect(() => {
      fetchCategories();
   }, []);

   const fetchCategories = async () => {
      setLoading(true);
      try {
         const data = await getAllCategoryTours();
         const flatCategories = flattenCategoryTour(data); // Chuyển đổi dữ liệu
         setCategories(flatCategories);
      } catch (error) {
         console.error('Lỗi khi tải danh sách category tour ', error);
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteCategory = async (data) => {
      try {
         await deleteCategory(data.id);
         notifySuccess('Xóa thành công', `Danh mục "${data.categoryName}" đã được xóa.`);
         fetchCategories();
      } catch (error) {
         notifyError('Lỗi khi xóa danh mục');
         console.error('Lỗi khi xóa danh mục');
      }
   };

   const columns = [
      {
         title: 'ID',
         dataIndex: 'id',
         key: 'id',
      },
      {
         title: 'Hình ảnh',
         dataIndex: 'avatar',
         key: 'avatar',
         render: (avatar) => {
            return (
               <Avatar
                  className="shape-avatar"
                  shape="square"
                  size={50}
                  src={avatar ? BASE_URL + avatar : BASE_URL + 'default-image.png'}
               />
            );
         },
      },
      {
         title: 'Tên danh mục',
         dataIndex: 'categoryName',
         key: 'categoryName',
         ...getColumnSearchProps('categoryName'),
         render: (text, record) => <span style={{ paddingLeft: `${record.level * 20}px` }}>{text}</span>,
      },
      {
         title: 'Đường dẫn (URL)',
         dataIndex: 'url',
         key: 'url',
         ...getColumnSearchProps('url'),
      },
      {
         title: 'Danh mục cha',
         dataIndex: 'parentCategoryTourName',
         key: 'parentCategoryTourName',
         render: (text) => text || 'Không có',
      },
      {
         title: 'Hành động',
         key: 'action',
         render: (_, record) => (
            <Space size="middle">
               <Link to={`/admin/category-tour/edit/${record.id}`}>
                  <Button type="link">
                     <EditOutlined /> Sửa
                  </Button>
               </Link>
               <Popconfirm
                  title="Bạn có chắc chắn muốn xóa?"
                  onConfirm={() => handleDeleteCategory(record)}
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
            title={<h6 className="font-semibold text-lg md:text-xl">Các danh mục tour</h6>}
            extra={
               <Link to="/admin/category-tour/create">
                  <Button type="primary">Thêm mới</Button>
               </Link>
            }
         >
            <Table
               dataSource={categories}
               columns={columns}
               rowKey="key"
               loading={loading}
               pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} danh mục`,
               }}
               scroll={{ x: 'max-content' }}
            />
         </Card>
      </>
   );
};

export default ListCategoryTour;
