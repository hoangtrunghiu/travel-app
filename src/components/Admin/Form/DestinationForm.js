import { useState, useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { getAllDestinations, addDestination, updateDestination } from '@/services/locationService';

import { useNotify } from '@/utils/notify';

const DestinationForm = ({ destination, onSuccess, onClose }) => {
   const [form] = Form.useForm();
   const { notifySuccess, notifyError, contextHolder } = useNotify();
   const [destinations, setDestinations] = useState([]);

   useEffect(() => {
      if (destination) {
         form.setFieldsValue(destination);
      } else {
         form.resetFields();
      }
   }, [destination, form]);

   // Fetch danh sách Châu lục
   useEffect(() => {
      const fetchAllDestination = async () => {
         try {
            const data = await getAllDestinations();
            setDestinations(data);
         } catch (error) {
            console.error('Lỗi khi lấy danh sách địa điểm:', error);
         }
      };
      fetchAllDestination();
   }, [destination]);
   // Xử lý submit form
   const handleSubmit = async (values) => {
      try {
         if (destination) {
            await updateDestination(destination.id, values);
         } else {
            await addDestination(values);
         }
         notifySuccess(
            destination ? 'Cập nhật thành công' : 'Thêm địa điểm thành công',
            `Địa điểm "${values.name}" đã được ${destination ? 'cập nhật' : 'thêm'}.`,
         );

         onSuccess?.(); // Cập nhật danh sách menu
         form.resetFields(); // Reset form
         onClose?.(); // Đóng modal
      } catch (error) {
         notifyError('Lỗi', error.message || 'Có lỗi xảy ra, vui lòng thử lại!');
      }
   };

   return (
      <>
         {contextHolder}
         <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
               name: '',
               parentId: null,
            }}
         >
            <Form.Item name="id" hidden>
               <Input />
            </Form.Item>
            <Form.Item
               name="name"
               label="Tên địa điểm"
               rules={[{ required: true, message: 'Vui lòng nhập tên địa điểm!' }]}
            >
               <Input placeholder="Nhập tên địa điểm" />
            </Form.Item>

            <Form.Item name="parentId" label="Châu lục">
               <Select allowClear placeholder="Chọn châu lục">
                  {destinations.map((des) => (
                     <Select.Option key={des.id} value={des.id}>
                        {des.name}
                     </Select.Option>
                  ))}
               </Select>
            </Form.Item>
            <Form.Item>
               <Button type="primary" htmlType="submit">
                  {destination ? 'Cập nhật' : 'Tạo mới'}
               </Button>
            </Form.Item>
         </Form>
      </>
   );
};

export default DestinationForm;
