import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, Select, Card, Row, Col, Spin, Typography, Divider } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { createPost, updatePost, getPostById } from '@/services/postService';
import categoryApi from '@/api/categoryApi';
import { flattenCategories } from '@/services/categoryService';
import CustomCKEditor from '@/components/Admin/Editor/CustomCKEditor';
import { generateSlug } from '@/utils/stringUtils'; // Giả sử bạn có utility để tạo slug
import { useNotify } from '@/utils/notify';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const PostForm = () => {
   const [form] = Form.useForm();
   const { id } = useParams();
   const navigate = useNavigate();
   const isEditMode = !!id;
   const { notifySuccess, notifyError, contextHolder } = useNotify();

   const [loading, setLoading] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [categories, setCategories] = useState([]);
   const [contentEditor, setContentEditor] = useState(''); //content ckeditor
   const [initialValues, setInitialValues] = useState({
      title: '',
      slug: '',
      description: '',
      content: '',
      published: true,
      mainCategoryId: undefined,
      relatedCategoryIds: [],
   });

   // Tải danh sách danh mục
   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const response = await categoryApi.getAll();
            const flatCategories = flattenCategories(response.data);
            setCategories(flatCategories);
         } catch (error) {
            console.error('Error fetching categories:', error);
            notifyError('Không thể tải danh sách danh mục');
         }
      };

      fetchCategories();
   }, []);

   // Tải dữ liệu bài viết nếu ở chế độ chỉnh sửa
   useEffect(() => {
      if (isEditMode) {
         const fetchPost = async () => {
            setLoading(true);
            try {
               const response = await getPostById(id);
               const postData = response.data;
               // Chuẩn bị dữ liệu cho form
               const formData = {
                  title: postData.title,
                  slug: postData.slug,
                  description: postData.description || '',
                  content: postData.content || '',
                  published: postData.published,
                  mainCategoryId: postData.mainCategoryId,
                  relatedCategoryIds: postData.relatedCategories.map((cat) => cat.id),
               };

               setInitialValues(formData);
               form.setFieldsValue(formData);
            } catch (error) {
               console.error('Error fetching post:', error);
               notifyError('Không thể tải thông tin bài viết');
            } finally {
               setLoading(false);
            }
         };

         fetchPost();
      }
   }, [id, isEditMode, form]);

   // Xử lý tự động tạo slug từ tiêu đề
   const handleTitleChange = (e) => {
      const title = e.target.value;
      if (isEditMode) {
         return;
      }
      const slug = generateSlug(title);
      form.setFieldsValue({ slug });
   };

   // Xử lý submit form
   const handleSubmit = async (values) => {
      setSubmitting(true);
      try {
         // Chuẩn bị dữ liệu để gửi đi
         const postData = {
            title: values.title,
            slug: values.slug,
            description: values.description,
            content: values.content,
            published: values.published,
            mainCategoryId: values.mainCategoryId,
            relatedCategoryIds: values.relatedCategoryIds || [],
         };

         let response;
         if (isEditMode) {
            response = await updatePost(id, postData);
            notifySuccess('Cập nhật bài viết thành công');
         } else {
            response = await createPost(postData);
            notifySuccess('Thêm bài viết mới thành công');
         }
         setTimeout(() => navigate('/admin/post/list'), 3000);
      } catch (error) {
         console.error('Error submitting post:', error);
         // Hiển thị thông báo lỗi cụ thể từ API nếu có
         if (error.response && error.response.data && error.response.data.message) {
            notifyError(error.response.data.message);
         } else {
            notifyError(isEditMode ? 'Không thể cập nhật bài viết' : 'Không thể tạo bài viết mới');
         }
      } finally {
         setSubmitting(false);
      }
   };

   if (loading) {
      return (
         <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
         </div>
      );
   }
   //console.log('================================================');

   return (
      <Card
         title={<Title level={4}>{isEditMode ? 'Cập nhật bài viết' : 'Thêm bài viết mới'}</Title>}
         className="header-solid"
      >
         {contextHolder}
         <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit} autoComplete="off">
            <Row gutter={24}>
               <Col xs={24} md={16}>
                  <Form.Item
                     name="title"
                     label="Tiêu đề"
                     rules={[
                        { required: true, message: 'Vui lòng nhập tiêu đề bài viết' },
                        { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
                        { max: 160, message: 'Tiêu đề không được vượt quá 160 ký tự' },
                     ]}
                  >
                     <Input placeholder="Nhập tiêu đề bài viết" onChange={handleTitleChange} />
                  </Form.Item>

                  <Form.Item
                     name="slug"
                     label="Slug"
                     rules={[
                        { required: true, message: 'Vui lòng nhập slug' },
                        { min: 5, message: 'Slug phải có ít nhất 5 ký tự' },
                        { max: 160, message: 'Slug không được vượt quá 160 ký tự' },
                        {
                           pattern: /^[a-z0-9-]*$/,
                           message: 'Slug chỉ được chứa các ký tự a-z, 0-9 và dấu gạch ngang',
                        },
                     ]}
                  >
                     <Input placeholder="slug-cua-bai-viet" />
                  </Form.Item>

                  <Form.Item name="description" label="Mô tả ngắn">
                     <TextArea placeholder="Nhập mô tả ngắn về bài viết" rows={4} showCount maxLength={500} />
                  </Form.Item>

                  <Form.Item
                     name="content"
                     label="Nội dung bài viết"
                     // rules={[{ required: true, message: 'Vui lòng nhập nội dung bài viết' }]}
                  >
                     <CustomCKEditor value={contentEditor} onChange={setContentEditor} />
                  </Form.Item>
               </Col>

               <Col xs={24} md={8}>
                  <Card title="Thông tin xuất bản">
                     <Form.Item name="published" label="Trạng thái xuất bản" valuePropName="checked">
                        <Switch checkedChildren="Đã xuất bản" unCheckedChildren="Chưa xuất bản" />
                     </Form.Item>

                     <Divider />

                     <Form.Item
                        name="mainCategoryId"
                        label="Danh mục chính"
                        rules={[{ required: true, message: 'Vui lòng chọn danh mục chính' }]}
                     >
                        <Select placeholder="Chọn danh mục chính" showSearch optionFilterProp="children">
                           {categories.map((category) => (
                              <Option key={category.id} value={category.id}>
                                 {category.title}
                              </Option>
                           ))}
                        </Select>
                     </Form.Item>

                     <Form.Item name="relatedCategoryIds" label="Danh mục liên quan">
                        <Select
                           mode="multiple"
                           placeholder="Chọn danh mục liên quan"
                           showSearch
                           optionFilterProp="children"
                        >
                           {categories.map((category) => (
                              <Option key={category.id} value={category.id}>
                                 {category.title}
                              </Option>
                           ))}
                        </Select>
                     </Form.Item>
                  </Card>
               </Col>
            </Row>

            <Row justify="end" style={{ marginTop: 24 }}>
               <Col>
                  <Button type="default" onClick={() => navigate('/admin/post/list')} style={{ marginRight: 8 }}>
                     Hủy
                  </Button>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                     {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                  </Button>
               </Col>
            </Row>
         </Form>
      </Card>
   );
};

export default PostForm;
