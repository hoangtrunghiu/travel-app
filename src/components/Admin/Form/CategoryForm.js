import { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Alert, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import categoryApi from '@/api/categoryApi';
import { addCategory, updateCategory, flattenCategories } from '@/services/categoryService';
import { useNotify } from '@/utils/notify';

const { Option } = Select;

const CategoryForm = ({ categoryUpdate }) => {
   const [form] = Form.useForm();
   const navigate = useNavigate();
   const { notifySuccess, contextHolder } = useNotify();
   const [categories, setCategories] = useState([]);
   const [errorMessage, setErrorMessage] = useState(null);

   // Cập nhật form khi categoryUpdate thay đổi
   useEffect(() => {
      //kiểm tra xem categoryUpdate có dữ liệu hay không trước khi cập nhật lên form
      if (categoryUpdate && Object.keys(categoryUpdate).length > 0) {
         form.setFieldsValue(categoryUpdate);
      } else {
         form.resetFields();
      }
   }, [categoryUpdate, form]);

   // Fetch danh sách danh mục cha
   useEffect(() => {
      const fetchAllCategory = async () => {
         try {
            const response = await categoryApi.getAll();
            const flatCategories = flattenCategories(response.data); // Chuyển đổi dữ liệu
            setCategories(flatCategories);
            //setCategories(response.data);
         } catch (error) {
            console.error('Lỗi khi lấy menu:', error);
         }
      };
      fetchAllCategory();
   }, []);

   // Xử lý submit form
   const onFinish = async (values) => {
      setErrorMessage(null);
      try {
         if (categoryUpdate) {
            await updateCategory(categoryUpdate.id, values);
         } else {
            await addCategory(values);
         }
         notifySuccess(
            categoryUpdate ? 'Cập nhật thành công' : 'Thêm danh mục thành công',
            `Danh mục "${values.title}" đã được ${categoryUpdate ? 'cập nhật' : 'thêm'}.`,
         );
         setTimeout(() => navigate('/admin/category/list'), 3000);
      } catch (error) {
         setErrorMessage(error.message || 'Có lỗi xảy ra, vui lòng thử lại!');
      }
   };

   return (
      <div className="layout-content">
         {contextHolder}
         <Card
            className="header-solid mb-24"
            title={
               <h6 className="font-semibold text-lg md:text-xl">
                  {categoryUpdate ? 'Cập nhật danh mục' : 'Tạo danh mục'}
               </h6>
            }
         >
            {errorMessage && (
               <Alert message="Lỗi" description={errorMessage} type="error" showIcon closable className="mb-4" />
            )}

            <Form form={form} layout="vertical" onFinish={onFinish}>
               <Form.Item name="id" hidden>
                  <Input />
               </Form.Item>
               <Form.Item
                  name="title"
                  label="Tên danh mục"
                  rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
               >
                  <Input placeholder="Nhập tên danh mục" />
               </Form.Item>
               <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}>
                  <Input placeholder="Nhập slug" />
               </Form.Item>
               <Form.Item name="description" label="Mô tả">
                  <Input.TextArea placeholder="Nhập mô tả danh mục" />
               </Form.Item>
               <Form.Item name="parentCategoryId" label="Danh mục cha">
                  <Select allowClear placeholder="Chọn danh mục cha">
                     {categories.map((cat) => (
                        <Option key={cat.id} value={cat.id}>
                           {cat.title}
                        </Option>
                     ))}
                  </Select>
               </Form.Item>
               <Form.Item>
                  <Button type="primary" htmlType="submit">
                     {categoryUpdate ? 'Cập nhật' : 'Tạo mới'}
                  </Button>
               </Form.Item>
            </Form>
         </Card>
      </div>
   );
};

export default CategoryForm;
