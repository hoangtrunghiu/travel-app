import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Tabs, Form, Input, Upload, message } from 'antd';
import { UserOutlined, PhoneOutlined, EditOutlined, UploadOutlined, MailOutlined } from '@ant-design/icons';
import axiosClient from '@/api/axiosClient';

const { TabPane } = Tabs;

const Profile = () => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [updateLoading, setUpdateLoading] = useState(false);
   const [passwordLoading, setPasswordLoading] = useState(false);
   const [form] = Form.useForm();
   const [passwordForm] = Form.useForm();

   useEffect(() => {
      const fetchUserProfile = async () => {
         try {
            const response = await axiosClient.get('/Users/profile');
            setUser(response.data);
            form.setFieldsValue({
               fullName: response.data.fullName,
               phoneNumber: response.data.phoneNumber,
            });
         } catch (error) {
            message.error('Failed to fetch profile data');
         } finally {
            setLoading(false);
         }
      };

      fetchUserProfile();
   }, [form]);

   const handleUpdateProfile = async (values) => {
      setUpdateLoading(true);
      try {
         await axiosClient.put('/Users/update-profile', values);
         message.success('Profile updated successfully');

         // Update local user data
         setUser((prev) => ({
            ...prev,
            fullName: values.fullName,
            phoneNumber: values.phoneNumber,
            avatar: values.avatar || prev.avatar,
         }));

         // Update localStorage
         const localUser = JSON.parse(localStorage.getItem('user'));
         localStorage.setItem(
            'user',
            JSON.stringify({
               ...localUser,
               fullName: values.fullName,
            }),
         );
      } catch (error) {
         message.error('Failed to update profile');
      } finally {
         setUpdateLoading(false);
      }
   };

   const handleChangePassword = async (values) => {
      if (values.newPassword !== values.confirmPassword) {
         message.error('New passwords do not match!');
         return;
      }

      setPasswordLoading(true);
      try {
         await axiosClient.put('/Users/change-password', {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
         });
         message.success('Password changed successfully');
         passwordForm.resetFields();
      } catch (error) {
         message.error(error.response?.data?.message || 'Failed to change password');
      } finally {
         setPasswordLoading(false);
      }
   };

   if (loading) {
      return <div className="flex justify-center items-center h-64">Loading...</div>;
   }

   return (
      <div className="max-w-4xl mx-auto p-4">
         <Card className="mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
               <Avatar
                  size={100}
                  src={user?.avatar}
                  icon={!user?.avatar && <UserOutlined />}
                  className="mb-4 md:mb-0"
               />
               <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-2">{user?.fullName}</h1>
                  <p className="text-gray-600 mb-1">
                     <MailOutlined className="mr-2" />
                     {user?.email}
                  </p>
                  {user?.phoneNumber && (
                     <p className="text-gray-600">
                        <PhoneOutlined className="mr-2" />
                        {user?.phoneNumber}
                     </p>
                  )}
               </div>
            </div>
         </Card>

         <Card>
            <Tabs defaultActiveKey="1">
               <TabPane tab="Edit Profile" key="1">
                  <Form form={form} layout="vertical" onFinish={handleUpdateProfile} className="max-w-lg">
                     <Form.Item
                        name="fullName"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                     >
                        <Input prefix={<UserOutlined />} placeholder="Full Name" />
                     </Form.Item>

                     <Form.Item name="phoneNumber" label="Phone Number">
                        <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
                     </Form.Item>

                     <Form.Item name="avatar" label="Avatar">
                        <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
                           <Button icon={<UploadOutlined />}>Upload Avatar</Button>
                        </Upload>
                        <p className="text-gray-500 text-sm mt-2">
                           Note: Avatar upload is a placeholder. In a real application, you would need to implement file
                           upload functionality.
                        </p>
                     </Form.Item>

                     <Form.Item>
                        <Button
                           type="primary"
                           htmlType="submit"
                           loading={updateLoading}
                           icon={<EditOutlined />}
                           className="bg-blue-600 hover:bg-blue-700"
                        >
                           Update Profile
                        </Button>
                     </Form.Item>
                  </Form>
               </TabPane>

               <TabPane tab="Change Password" key="2">
                  <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword} className="max-w-lg">
                     <Form.Item
                        name="currentPassword"
                        label="Current Password"
                        rules={[{ required: true, message: 'Please input your current password!' }]}
                     >
                        <Input.Password placeholder="Current Password" />
                     </Form.Item>

                     <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                           { required: true, message: 'Please input your new password!' },
                           { min: 6, message: 'Password must be at least 6 characters!' },
                        ]}
                     >
                        <Input.Password placeholder="New Password" />
                     </Form.Item>

                     <Form.Item
                        name="confirmPassword"
                        label="Confirm New Password"
                        rules={[
                           { required: true, message: 'Please confirm your new password!' },
                           { min: 6, message: 'Password must be at least 6 characters!' },
                        ]}
                     >
                        <Input.Password placeholder="Confirm New Password" />
                     </Form.Item>

                     <Form.Item>
                        <Button
                           type="primary"
                           htmlType="submit"
                           loading={passwordLoading}
                           className="bg-blue-600 hover:bg-blue-700"
                        >
                           Change Password
                        </Button>
                     </Form.Item>
                  </Form>
               </TabPane>
            </Tabs>
         </Card>
      </div>
   );
};

export default Profile;
