import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
   const navigate = useNavigate();

   const handleLogout = () => {
      // Clear local storage
      localStorage.removeItem('jwt'); // Updated key to 'jwt'
      localStorage.removeItem('user');

      // Redirect to login page
      navigate('/login');
   };

   return (
      <Button onClick={handleLogout} icon={<LogoutOutlined />} className="hover:text-red-500">
         Logout
      </Button>
   );
};

export default Logout;
