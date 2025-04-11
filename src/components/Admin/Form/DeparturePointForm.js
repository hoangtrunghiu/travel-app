import { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { addDeparturePoint, updateDeparturePoint } from '@/services/locationService';

import { useNotify } from '@/utils/notify';

const DeparturePointForm = ({ departurePoint, onSuccess, onClose }) => {
   const [form] = Form.useForm();
   const { notifySuccess, notifyError, contextHolder } = useNotify();

   useEffect(() => {
      if (departurePoint) {
         form.setFieldsValue(departurePoint);
      } else {
         form.resetFields();
      }
   }, [departurePoint, form]);

   // Xử lý submit form
   const handleSubmit = async (values) => {
      try {
         if (departurePoint) {
            await updateDeparturePoint(departurePoint.id, values);
         } else {
            await addDeparturePoint(values);
         }
         notifySuccess(
            departurePoint ? 'Cập nhật thành công' : 'Thêm địa điểm thành công',
            `Địa điểm "${values.name}" đã được ${departurePoint ? 'cập nhật' : 'thêm'}.`,
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
            <Form.Item>
               <Button type="primary" htmlType="submit">
                  {departurePoint ? 'Cập nhật' : 'Tạo mới'}
               </Button>
            </Form.Item>
         </Form>
      </>
   );
};

export default DeparturePointForm;
