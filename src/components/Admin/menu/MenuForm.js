import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Switch } from 'antd';
import { addMenu, updateMenu } from '@/services/menuService';
import { useNotify } from '@/utils/notify'; //hiển thị thông báo
import menuApi from '@/api/menuApi';

export default function MenuForm({ menu, onSuccess, onClose }) {
   const { notifySuccess, notifyError, contextHolder } = useNotify();
   const [menus, setMenus] = useState([]);

   const [form] = Form.useForm();

   useEffect(() => {
      if (menu) {
         form.setFieldsValue(menu);
      } else {
         form.resetFields();
      }
   }, [menu, form]);

   useEffect(() => {
      fetchAllMenus();
   }, []);

   const fetchAllMenus = async () => {
      try {
         const response = await menuApi.getMenuHierarchy();
         if (response?.data?.length) {
            // console.log('Fetched menus:', response.data);
            setMenus(response.data);
         }
      } catch (error) {
         console.error('Lỗi khi lấy menu:', error);
      }
   };

   const handleSubmit = async (values) => {
      try {
         if (menu) {
            await updateMenu(menu.Id, values);
         } else {
            await addMenu(values);
         }

         notifySuccess(
            menu ? 'Cập nhật thành công' : 'Thêm menu thành công',
            `Menu "${values.MenuName}" đã được ${menu ? 'cập nhật' : 'thêm'}.`,
         );

         onSuccess?.(); // Cập nhật danh sách menu
         form.resetFields(); // Reset form
         onClose?.(); // Đóng modal
      } catch (error) {
         notifyError('Lỗi', error.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
      }
   };

   return (
      <>
         {contextHolder} {/* Đặt contextHolder ở đây để tránh lỗi */}
         <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
               MenuName: '',
               MenuUrl: '',
               IndexNumber: 0,
               ParentId: null,
               IsHide: false,
            }}
         >
            <Form.Item
               label="Tên Menu"
               name="MenuName"
               rules={[{ required: true, message: 'Vui lòng nhập tên menu!' }]}
            >
               <Input placeholder="Nhập tên menu" />
            </Form.Item>

            <Form.Item
               label="URL Menu"
               name="MenuUrl"
               rules={[
                  { required: true, message: 'Vui lòng nhập URL menu!' },
                  {
                     validator: (_, value) => {
                        if (!value) return Promise.resolve(); // Nếu trống, đã có required kiểm tra
                        const regex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
                        if (regex.test(value)) {
                           return Promise.resolve();
                        }
                        return Promise.reject(new Error('URL không hợp lệ! Chỉ dùng chữ thường, số và dấu -'));
                     },
                  },
               ]}
            >
               <Input placeholder="Nhập URL menu" />
            </Form.Item>

            <Form.Item
               label="Thứ tự hiển thị"
               name="IndexNumber"
               rules={[{ required: true, message: 'Vui lòng nhập số thứ tự!' }]}
            >
               <Input type="number" placeholder="Nhập số thứ tự" />
            </Form.Item>

            <Form.Item label="Menu cha" name="ParentId">
               <Select placeholder="Chọn menu cha" allowClear>
                  {menus.map((item) => (
                     <Select.Option key={item.Id} value={item.Id}>
                        {item.DisplayName}
                     </Select.Option>
                  ))}
               </Select>
            </Form.Item>

            <Form.Item label="Ẩn Menu" name="IsHide" valuePropName="checked">
               <Switch />
            </Form.Item>

            <Form.Item>
               <Button type="primary" htmlType="submit">
                  {menu ? 'Cập nhật Menu' : 'Thêm Menu'}
               </Button>
            </Form.Item>
         </Form>
      </>
   );
}
