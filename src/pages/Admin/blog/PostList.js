import React, { useState, useEffect } from 'react';
import { Table, Button, Select, Popconfirm, Space, Card } from 'antd';
import { getAllPosts2, deletePost } from '@/services/postService';
import { flattenCategories } from '@/services/categoryService';
import categoryApi from '@/api/categoryApi';
import { Link } from 'react-router-dom';
import { useNotify } from '@/utils/notify';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SearchTable from '@/utils/searchTable';

const PostList = () => {
   const [posts, setPosts] = useState([]);
   const [categories, setCategories] = useState([]);
   const [loading, setLoading] = useState(false);
   const { notifySuccess, contextHolder } = useNotify(); //thông báo
   const { getColumnSearchProps } = SearchTable(); //tìm kiếm trên table

   // State phân trang
   const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      total: 0,
   });

   const [selectedCategory, setSelectedCategory] = useState(null);
   const [publishedFilter, setPublishedFilter] = useState(null); // Thêm filter published

   useEffect(() => {
      fetchPosts();
      fetchCategories();
   }, [pagination.current, pagination.pageSize, selectedCategory, publishedFilter]);

   const fetchCategories = async () => {
      try {
         const categoryResponse = await categoryApi.getAll();
         const flatCategories = flattenCategories(categoryResponse.data);
         setCategories(flatCategories);
      } catch (error) {
         console.error('Error loading categories', error);
      }
   };

   const fetchPosts = async () => {
      setLoading(true);
      try {
         const response = await getAllPosts2({
            page: pagination.current,
            pageSize: pagination.pageSize,
            categoryId: selectedCategory,
            published: publishedFilter,
         });

         setPosts(response.data);
         setPagination((prev) => ({
            ...prev,
            total: response.totalCount,
         }));
      } catch (error) {
         console.error('Error loading posts', error);
      } finally {
         setLoading(false);
      }
   };

   const handleCategoryChange = (categoryId) => {
      setSelectedCategory(categoryId);
      setPagination((prev) => ({ ...prev, current: 1 }));
   };

   const handlePublishedChange = (value) => {
      setPublishedFilter(value);
      setPagination((prev) => ({ ...prev, current: 1 }));
   };

   const handleTableChange = (newPagination) => {
      setPagination({
         current: newPagination.current,
         pageSize: newPagination.pageSize,
         total: pagination.total,
      });
   };

   const handleDelete = async (data) => {
      try {
         await deletePost(data.postId);
         notifySuccess('Xóa thành công', `Bài post "${data.title}" đã được xóa.`);

         // Kiểm tra nếu sau khi xóa thì trang hiện tại không còn item nào
         if (posts.length === 1 && pagination.current > 1) {
            setPagination((prev) => ({ ...prev, current: prev.current - 1 }));
         } else {
            fetchPosts();
         }
      } catch (error) {
         console.error('Lỗi khi xóa bài post', error);
      }
   };

   const columns = [
      {
         title: 'Tiêu đề',
         dataIndex: 'title',
         key: 'title',
         ...getColumnSearchProps('title'),
         ellipsis: true,
      },
      {
         title: 'Danh mục chính',
         dataIndex: 'mainCategoryName',
         key: 'mainCategoryName',
         filters: categories.map((cat) => ({ text: cat.title, value: cat.id })),
         onFilter: (value, record) => record.mainCategoryId === value,
      },
      {
         title: 'Ngày tạo',
         dataIndex: 'dateCreated',
         key: 'dateCreated',
         render: (text) => new Date(text).toLocaleDateString('vi-VN'),
         sorter: (a, b) => new Date(a.dateCreated) - new Date(b.dateCreated),
      },
      {
         title: 'Trạng thái',
         dataIndex: 'published',
         key: 'published',
         render: (published) => (
            <span style={{ color: published ? 'green' : 'red' }}>{published ? 'Đã xuất bản' : 'Chưa xuất bản'}</span>
         ),
         filters: [
            { text: 'Đã xuất bản', value: true },
            { text: 'Chưa xuất bản', value: false },
         ],
         onFilter: (value, record) => record.published === value,
      },
      {
         title: 'Hành động',
         key: 'action',
         render: (_, record) => (
            <Space size="middle">
               <Link to={`/admin/post/edit/${record.postId}`}>
                  <Button type="link">
                     <EditOutlined /> Sửa
                  </Button>
               </Link>
               <Popconfirm
                  title="Bạn có chắc chắn muốn xóa?"
                  onConfirm={() => handleDelete(record)}
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
            title={<h6 className="font-semibold text-lg md:text-xl">Các bài post</h6>}
            extra={
               <Link to="/admin/post/create">
                  <Button type="primary">Thêm mới</Button>
               </Link>
            }
         >
            <div style={{ display: 'flex', marginBottom: 16, gap: 16 }}>
               <Select
                  placeholder="Lọc theo danh mục"
                  onChange={handleCategoryChange}
                  style={{ width: 200 }}
                  value={selectedCategory}
                  allowClear
               >
                  {categories.map((category) => (
                     <Select.Option key={category.id} value={category.id}>
                        {category.title}
                     </Select.Option>
                  ))}
               </Select>

               <Select
                  placeholder="Trạng thái xuất bản"
                  onChange={handlePublishedChange}
                  style={{ width: 200 }}
                  value={publishedFilter}
                  allowClear
               >
                  <Select.Option value={true}>Đã xuất bản</Select.Option>
                  <Select.Option value={false}>Chưa xuất bản</Select.Option>
               </Select>
            </div>

            <Table
               dataSource={posts}
               columns={columns}
               rowKey="postId"
               loading={loading}
               pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: pagination.total,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '20', '50'],
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài viết`,
               }}
               onChange={handleTableChange}
               scroll={{ x: 'max-content' }}
            />
         </Card>
      </>
   );
};

export default PostList;
