import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, Card } from 'antd';
import { deleteCategory, flattenCategories } from '@/services/categoryService';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import categoryApi from '@/api/categoryApi';
import { useNotify } from '@/utils/notify';
import SearchTable from '@/utils/searchTable';

import { Link } from 'react-router-dom';

const ListCategory = () => {
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(false);
   const { notifySuccess, contextHolder } = useNotify();
   const { getColumnSearchProps } = SearchTable(); //tìm kiếm trên table

   useEffect(() => {
      fetchCategories();
   }, []);

   const fetchCategories = async () => {
      setLoading(true);
      try {
         const response = await categoryApi.getAll();
         const flatCategories = flattenCategories(response.data); // Chuyển đổi dữ liệu
         setCategories(flatCategories);
      } catch (error) {
         console.error('Lỗi khi tải danh sách category ', error);
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteCategory = async (data) => {
      try {
         await deleteCategory(data.id);
         notifySuccess('Xóa thành công', `Danh mục "${data.title}" đã được xóa.`);
         fetchCategories();
      } catch (error) {
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
         title: 'Tên danh mục',
         dataIndex: 'title',
         key: 'title',
         ...getColumnSearchProps('title'),
         render: (text, record) => (
            // <span style={{ paddingLeft: `${record.level * 20}px`, fontWeight: record.level === 0 ? 'bold' : 'normal' }}>
            <span style={{ paddingLeft: `${record.level * 20}px` }}>{text}</span>
         ),
      },
      {
         title: 'Đường dẫn (URL)',
         dataIndex: 'slug',
         key: 'slug',
         ...getColumnSearchProps('slug'),
      },
      {
         title: 'Danh mục cha',
         dataIndex: 'parentCategoryTitle',
         key: 'parentCategoryTitle',
         render: (text) => text || 'Không có',
      },
      {
         title: 'Hành động',
         key: 'action',
         render: (_, record) => (
            <Space size="middle">
               <Link to={`/admin/category/edit/${record.id}`}>
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
            title={<h6 className="font-semibold text-lg md:text-xl">Các danh mục bài viết</h6>}
            extra={
               <Link to="/admin/category/create">
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

export default ListCategory;
