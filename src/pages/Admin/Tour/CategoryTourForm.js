import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Switch, Select, Card, Row, Col, Spin, Typography, Alert, Popconfirm } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { addCategory, updateCategory, getCategoryTourById, getAllCategoryTours } from '@/services/categoryTourService';
import { getImagesByEntity, updateEntityImages } from '@/services/libraryImageService';
import { flattenCategoryTour } from '@/utils/flattenData';
import CustomCKEditor from '@/components/Admin/Editor/CustomCKEditor';
import { generateSlug } from '@/utils/stringUtils';
import { useNotify } from '@/utils/notify';
import AvatarPicker from '@/components/Admin/Form/AvatarPicker';
import ImageGallery from '@/components/Admin/Form/ImageGallery';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CategoryTourForm = () => {
   const [form] = Form.useForm();
   const { id } = useParams();
   const navigate = useNavigate();
   const isEditMode = !!id;
   const { notifyError, contextHolder } = useNotify();
   const [errorMessage, setErrorMessage] = useState(null); //nhận về lỗi server trả về
   const [successMessage, setSuccessMessage] = useState(null);

   const [loading, setLoading] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [categories, setCategories] = useState([]);
   const [categoryTour, setCategoryTour] = useState([]);
   const [selectedImages, setSelectedImages] = useState([]);
   const [initialValues, setInitialValues] = useState({
      categoryName: '', //Tên thể loại
      topic: '', //Tên chủ đề chính
      url: '', //Đường dẫn
      description: '', //Mô tả ngắn
      contentIntro: '', //Nội dung chi tiết đầu trang
      contentDetail: '', //Nội dung chi tiết cuối trang
      avatar: '', //Hình đại diện
      metaTitle: '', //Tiêu đề SEO
      metaDescription: '', //Mô tả SEO
      metaKeywords: '', //Từ khóa SEO
      isIndexRobot: true, //Bật tắt lập chỉ mục
      parentCategoryTourId: undefined, //Danh mục cha nếu có
   });
   const userData = JSON.parse(localStorage.getItem('user'));

   // Tải danh sách danh mục
   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const data = await getAllCategoryTours();
            const flatCategories = flattenCategoryTour(data);
            setCategories(flatCategories);
         } catch (error) {
            console.error('Error fetching categories:', error);
            notifyError('Không thể tải danh sách danh mục');
         }
      };

      fetchCategories();
   }, []);

   // Tải dữ liệu danh mục nếu ở chế độ chỉnh sửa
   useEffect(() => {
      if (isEditMode) {
         const fetchCategoryTour = async () => {
            setLoading(true);
            try {
               const postData = await getCategoryTourById(id);
               setCategoryTour(postData);
               // Chuẩn bị dữ liệu cho form
               const formData = {
                  categoryName: postData.categoryName,
                  topic: postData.topic,
                  url: postData.url,
                  description: postData.description || '',
                  contentIntro: postData.contentIntro || '',
                  contentDetail: postData.contentDetail || '',
                  avatar: postData.avatar || '',
                  metaTitle: postData.metaTitle || '',
                  metaDescription: postData.metaDescription || '',
                  metaKeywords: postData.metaKeywords || '',
                  isIndexRobot: postData.isIndexRobot,
                  parentCategoryTourId: postData.parentCategoryTourId,
               };
               setInitialValues(formData);
               form.setFieldsValue(formData);

               // Tải thư viện ảnh
               try {
                  const images = await getImagesByEntity('CategoryTour', id);
                  const imageUrls = images.map((img) => img.imageUrl);
                  setSelectedImages(imageUrls);
               } catch (imageError) {
                  console.error('Error fetching images:', imageError);
                  notifyError('Không thể tải hình ảnh của danh mục');
               }
            } catch (error) {
               console.error('Error fetching post:', error);
               notifyError('Không thể tải thông tin danh mục');
            } finally {
               setLoading(false);
            }
         };

         fetchCategoryTour();
      }
   }, [id, isEditMode, form]);

   // Xử lý tự động tạo url từ tiêu đề
   const handleTitleChange = (e) => {
      const title = e.target.value;
      if (isEditMode) {
         return;
      }
      const url = generateSlug(title);
      form.setFieldsValue({ url: url });
   };

   // Xử lý submit form
   const handleSubmit = async (values) => {
      setSubmitting(true);
      try {
         // Chuẩn bị dữ liệu để gửi đi
         const postData = {
            categoryName: values.categoryName,
            topic: values.topic,
            url: values.url,
            description: values.description,
            contentIntro: values.contentIntro,
            contentDetail: values.contentDetail,
            avatar: values.avatar,
            metaTitle: values.metaTitle,
            metaDescription: values.metaDescription,
            metaKeywords: values.metaKeywords,
            isIndexRobot: values.isIndexRobot,
            parentCategoryTourId: values.parentCategoryTourId,
            ...(isEditMode
               ? { editor: userData.email, editorName: userData.fullName, id: categoryTour.id } // Nếu edit, dùng editor
               : { creator: userData.email, creatorName: userData.fullName }), // Nếu tạo mới, dùng creator
         };
         let entityId;
         let response;
         if (isEditMode) {
            await updateCategory(id, postData);
            entityId = id;
            setSuccessMessage('Cập nhật danh mục thành công');
         } else {
            response = await addCategory(postData);
            entityId = response.id;
            setSuccessMessage('Thêm danh mục mới thành công');
         }
         //thêm/cập nhật bộ sưu tập
         try {
            await updateEntityImages('CategoryTour', entityId, selectedImages);
         } catch (imageError) {
            console.error('Error saving images:', imageError);
         }
         //end image

         window.scrollTo({ top: 0, behavior: 'smooth' });
         setErrorMessage(null);
         navigate(`/admin/category-tour/edit/${isEditMode ? id : response.id}`);
      } catch (error) {
         console.error('Error submitting post:', error);
         window.scrollTo(0, 0);
         setSuccessMessage(null);
         setErrorMessage(error.message || 'Có lỗi xảy ra, vui lòng thử lại!');
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

   return (
      <Card title={<Title level={4}>{isEditMode ? 'Cập nhật danh mục tour' : 'Thêm danh mục tour mới'}</Title>}>
         {contextHolder}
         {errorMessage && <Alert description={errorMessage} type="error" showIcon closable className="mb-4" />}
         {successMessage && <Alert description={successMessage} type="success" showIcon closable className="mb-4" />}
         <Form form={form} layout="vertical" initialValues={initialValues} onFinish={handleSubmit} autoComplete="off">
            <Row gutter={24}>
               <Col xs={24} md={16}>
                  <Card>
                     <Form.Item
                        name="metaKeywords"
                        label="Từ khóa trang (*)"
                        rules={[
                           { required: true, message: 'Vui lòng nhập từ khóa' },
                           { max: 250, message: 'Từ khóa không được vượt quá 250 ký tự' },
                        ]}
                     >
                        <Input placeholder="Nhập từ khóa trang" />
                     </Form.Item>
                     <Form.Item
                        name="categoryName"
                        label="Tên thể loại (*)"
                        rules={[
                           { required: true, message: 'Vui lòng nhập tên thể loại' },
                           { min: 5, message: 'Tên thể loại phải có ít nhất 5 ký tự' },
                           { max: 160, message: 'Tên thể loại không được vượt quá 160 ký tự' },
                        ]}
                     >
                        <Input placeholder="Nhập tiêu đề bài viết" onChange={handleTitleChange} />
                     </Form.Item>
                     <Form.Item
                        name="topic"
                        label="Chủ đề chính (H1) (*)"
                        rules={[
                           { required: true, message: 'Vui lòng nhập chủ đề thể loại' },
                           { min: 5, message: 'Chủ đề thể loại phải có ít nhất 5 ký tự' },
                           { max: 160, message: 'Chủ đề thể loại không được vượt quá 160 ký tự' },
                        ]}
                     >
                        <Input placeholder="Nhập tiêu đề bài viết" onChange={handleTitleChange} />
                     </Form.Item>
                     <Form.Item name="description" label="Mô tả ngắn">
                        <TextArea placeholder="Nhập mô tả ngắn về bài viết" rows={4} showCount maxLength={500} />
                     </Form.Item>

                     <Form.Item name="contentIntro" label="Nội dung chi tiết đầu trang">
                        <CustomCKEditor />
                     </Form.Item>

                     <Form.Item name="contentDetail" label="Nội dung chi tiết cuối trang">
                        <CustomCKEditor />
                     </Form.Item>
                  </Card>
                  <br />
                  <Card type="inner" title="Bộ sưu tập hình ảnh">
                     <ImageGallery value={selectedImages} onChange={setSelectedImages} />
                  </Card>
                  <br />
                  {/* Tối ưu seo */}
                  <Card type="inner" title="Tối ưu SEO">
                     <Form.Item
                        name="metaTitle"
                        label="Tiêu đề Trang (<title>) (*)"
                        rules={[
                           { required: true, message: 'Vui lòng nhập tiêu SEO' },
                           { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
                           { max: 160, message: 'Tiêu đề không được vượt quá 160 ký tự' },
                        ]}
                     >
                        <Input placeholder="Nhập tiêu đề SEO danh mục" showCount />
                     </Form.Item>
                     <Form.Item name="metaDescription" label="Mô Tả Trang ( <meta Description> ) (*)">
                        <TextArea
                           placeholder="Nhập mô tả ngắn về bài viết"
                           rows={4}
                           showCount
                           maxLength={500}
                           style={{ fontWeight: 'normal' }}
                        />
                     </Form.Item>
                     <Form.Item
                        name="url"
                        label="Đường dẫn(URL) (*)"
                        rules={[
                           { required: true, message: 'Vui lòng nhập URL' },
                           { min: 5, message: 'URL phải có ít nhất 5 ký tự' },
                           { max: 160, message: 'URL không được vượt quá 160 ký tự' },
                           {
                              pattern: /^[a-z0-9-]*$/,
                              message: 'URL chỉ được chứa các ký tự a-z, 0-9 và dấu gạch ngang',
                           },
                        ]}
                     >
                        <Input placeholder="url-danh-muc" />
                     </Form.Item>
                     <Form.Item name="isIndexRobot" label="Index, Follow" valuePropName="checked">
                        <Switch checkedChildren="Đang bật" unCheckedChildren="Đang tắt" />
                     </Form.Item>
                  </Card>
                  <br />
               </Col>

               <Col xs={24} md={8}>
                  <Card type="inner" title="Phân loại">
                     <Form.Item
                        name="parentCategoryTourId"
                        label="Danh mục cha"
                        // rules={[{ required: true, message: 'Vui lòng chọn danh mục cha' }]}
                     >
                        <Select placeholder="Chọn danh mục cha" allowClear showSearch optionFilterProp="children">
                           {categories.map((category) => (
                              <Option key={category.id} value={category.id}>
                                 {category.categoryName}
                              </Option>
                           ))}
                        </Select>
                     </Form.Item>
                  </Card>
                  <br />
                  <Card type="inner" title="Hình đại diện">
                     <Form.Item name="avatar">
                        <AvatarPicker />
                     </Form.Item>
                  </Card>
                  <br />
                  {isEditMode && (
                     <Card type="inner" title="Sản phẩm được tạo/cập nhật bởi">
                        <div>
                           <strong>Người tạo</strong>
                           <p>Email: {categoryTour.creator}</p>
                           <p>Tên: {categoryTour.creatorName}</p>
                        </div>
                        {categoryTour.editor && (
                           <div>
                              <strong>Người chỉnh sửa</strong>
                              <p>Email: {categoryTour.creator}</p>
                              <p>Tên: {categoryTour.creatorName}</p>
                           </div>
                        )}
                     </Card>
                  )}
               </Col>
            </Row>

            <Row justify="end" style={{ marginTop: 24 }}>
               <Col>
                  <Popconfirm
                     title="Bạn có chắc chắn muốn hủy?"
                     okText="Có"
                     cancelText="Không"
                     onConfirm={() => navigate('/admin/category-tour/list')}
                  >
                     <Button type="default" style={{ marginRight: 8 }}>
                        Hủy
                     </Button>
                  </Popconfirm>
                  <Button type="primary" htmlType="submit" loading={submitting}>
                     {isEditMode ? 'Cập nhật' : 'Thêm mới'}
                  </Button>
               </Col>
            </Row>
         </Form>
      </Card>
   );
};

export default CategoryTourForm;
