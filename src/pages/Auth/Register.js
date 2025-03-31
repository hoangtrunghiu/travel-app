import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';

const Register = () => {
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const onFinish = async (values) => {
      if (values.password !== values.confirmPassword) {
         message.error('Passwords do not match!');
         return;
      }

      setLoading(true);
      try {
         await axiosClient.post('/Users/register-admin', {
            email: values.email,
            password: values.password,
            fullName: values.fullName,
            phoneNumber: values.phoneNumber,
         });

         message.success('Registration successful! Please log in.');
         navigate('/login');
      } catch (error) {
         message.error(error.response?.data?.message || 'Registration failed');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex justify-center items-center bg-gray-100">
         <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Register</h1>

            <Form name="register" className="register-form" onFinish={onFinish}>
               <Form.Item
                  name="email"
                  rules={[
                     { required: true, message: 'Please input your email!' },
                     { type: 'email', message: 'Please enter a valid email!' },
                  ]}
               >
                  <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" size="large" />
               </Form.Item>

               <Form.Item name="fullName" rules={[{ required: true, message: 'Please input your full name!' }]}>
                  <Input
                     prefix={<UserOutlined className="site-form-item-icon" />}
                     placeholder="Full Name"
                     size="large"
                  />
               </Form.Item>

               <Form.Item name="phoneNumber" rules={[{ required: false }]}>
                  <Input
                     prefix={<PhoneOutlined className="site-form-item-icon" />}
                     placeholder="Phone Number (optional)"
                     size="large"
                  />
               </Form.Item>

               <Form.Item
                  name="password"
                  rules={[
                     { required: true, message: 'Please input your password!' },
                     { min: 6, message: 'Password must be at least 6 characters!' },
                  ]}
               >
                  <Input.Password
                     prefix={<LockOutlined className="site-form-item-icon" />}
                     placeholder="Password"
                     size="large"
                  />
               </Form.Item>

               <Form.Item
                  name="confirmPassword"
                  rules={[
                     { required: true, message: 'Please confirm your password!' },
                     { min: 6, message: 'Password must be at least 6 characters!' },
                  ]}
               >
                  <Input.Password
                     prefix={<LockOutlined className="site-form-item-icon" />}
                     placeholder="Confirm Password"
                     size="large"
                  />
               </Form.Item>

               <Form.Item>
                  <Button
                     type="primary"
                     htmlType="submit"
                     className="w-full bg-blue-600 hover:bg-blue-700"
                     loading={loading}
                     size="large"
                  >
                     Register
                  </Button>
                  <div className="mt-4 text-center">
                     Already have an account?{' '}
                     <a href="/login" className="text-blue-600 hover:text-blue-800">
                        Log in
                     </a>
                  </div>
               </Form.Item>
            </Form>
         </div>
      </div>
   );
};

export default Register;
