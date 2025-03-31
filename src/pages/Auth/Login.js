import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';

const Login = () => {
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const onFinish = async (values) => {
      setLoading(true);
      try {
         const response = await axiosClient.post('/Users/login', {
            userName: values.email,
            password: values.password,
         });

         // Save token and user info to localStorage
         localStorage.setItem('jwt', response.data.token); // Updated key to 'jwt'
         localStorage.setItem(
            'user',
            JSON.stringify({
               id: response.data.id,
               email: response.data.email,
               fullName: response.data.fullName,
               // avatar: response.data.avatar,
               roles: response.data.roles,
            }),
         );

         message.success('Login successful!');
         navigate('/');
      } catch (error) {
         message.error(error.response?.data?.message || 'Login failed');
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
         <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h1>

            <Form name="login" className="login-form" initialValues={{ remember: true }} onFinish={onFinish}>
               <Form.Item
                  name="email"
                  rules={[
                     { required: true, message: 'Please input your email!' },
                     { type: 'email', message: 'Please enter a valid email!' },
                  ]}
               >
                  <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" size="large" />
               </Form.Item>

               <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                  <Input.Password
                     prefix={<LockOutlined className="site-form-item-icon" />}
                     placeholder="Password"
                     size="large"
                  />
               </Form.Item>

               <Form.Item>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                     <Checkbox>Remember me</Checkbox>
                  </Form.Item>

                  <a className="float-right text-blue-600 hover:text-blue-800" href="/forgot-password">
                     Forgot password
                  </a>
               </Form.Item>

               <Form.Item>
                  <Button
                     type="primary"
                     htmlType="submit"
                     className="w-full bg-blue-600 hover:bg-blue-700"
                     loading={loading}
                     size="large"
                  >
                     Log in
                  </Button>
                  <div className="mt-4 text-center">
                     Don't have an account?{' '}
                     <a href="/register" className="text-blue-600 hover:text-blue-800">
                        Register now!
                     </a>
                  </div>
               </Form.Item>
            </Form>
         </div>
      </div>
   );
};

export default Login;
