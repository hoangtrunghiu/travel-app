import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '@/components/User/Layout';

// Import các page
import Home from '@/components/Admin/pages/Home';
import HomePage from '@/pages/User/Home';
import Tables from '@/components/Admin/pages/Tables';
import Billing from '@/components/Admin/pages/Billing';
import Rtl from '@/components/Admin/pages/Rtl';
import Main from '@/components/Admin/layout/Main';
//page admin
import MenuManager from '@/pages/Admin/menu/MenuManager';
import ListCategory from '@/pages/Admin/blog/ListCategory';
import CreateCategory from '@/pages/Admin/blog/CreateCategory';
import UpdateCategory from '@/pages/Admin/blog/UpdateCategory';
import FileManager from '@/components/Admin/FileManager/FileManager';
import FilePickerDemo from '@/components/Admin/FileManager/FilePickerDemo';
import PostList from '@/pages/Admin/blog/PostList';
import PostForm from '@/pages/Admin/blog/PostForm';

import Register from '@/pages/Auth/Register';
import AdminLogin from '@/pages/Auth/AdminLogin';
import Profile from '@/pages/Auth/Profile';
import ProtectedRoute from '@/pages/Auth/ProtectedRoute';
import ListCategoryTour from '@/pages/Admin/Tour/ListCategoryTour';
import CategoryTourForm from '@/pages/Admin/Tour/CategoryTourForm';

const AppRoutes = () => {
   return (
      <Router>
         <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            {/* Các Route Admin được bảo vệ */}
            <Route element={<ProtectedRoute />}>
               {/* Layout Admin */}
               <Route path="/admin/*" element={<Main />}>
                  <Route index element={<Navigate to="/admin/dashboard" />} /> {/* Điều hướng mặc định */}
                  <Route path="dashboard" element={<Home />} />
                  <Route path="tables" element={<Tables />} />
                  <Route path="billing" element={<Billing />} />
                  <Route path="rtl" element={<Rtl />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="menus" element={<MenuManager />} />
                  <Route path="category/list" element={<ListCategory />} />
                  <Route path="category/create" element={<CreateCategory />} />
                  <Route path="category/edit/:id" element={<UpdateCategory />} />
                  <Route path="files" element={<FileManager />} />
                  <Route path="file-demo" element={<FilePickerDemo />} />
                  <Route path="post/list" element={<PostList />} />
                  <Route path="post/create" element={<PostForm />} />
                  <Route path="post/edit/:id" element={<PostForm />} />
                  <Route path="category-tour/list" element={<ListCategoryTour />} />
                  <Route path="category-tour/create" element={<CategoryTourForm />} />
                  <Route path="category-tour/edit/:id" element={<CategoryTourForm />} />
               </Route>
            </Route>
            {/* Layout User */}
            <Route path="/" element={<UserLayout />}>
               <Route index element={<HomePage />} />
               {/* <Route path="profile" element={<Profile />} />
               <Route path="orders" element={<Orders />} /> */}
            </Route>

            {/* Redirect tất cả route không tồn tại về trang chủ */}
            <Route path="*" element={<Navigate to="/" />} />
         </Routes>
      </Router>
   );
};

export default AppRoutes;
