import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '@/components/User/Layout';

// Import các page
import Home from '@/components/Admin/pages/Home';
import HomePage from '@/pages/User/Home';
import Tables from '@/components/Admin/pages/Tables';
import Billing from '@/components/Admin/pages/Billing';
import Rtl from '@/components/Admin/pages/Rtl';
import Profile from '@/components/Admin/pages/Profile';
import SignUp from '@/components/Admin/pages/SignUp';
import SignIn from '@/components/Admin/pages/SignIn';
import Main from '@/components/Admin/layout/Main';

const AppRoutes = () => {
   return (
      <Router>
         <Routes>
            {/* Authentication Routes */}
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />

            {/* Layout Admin */}
            <Route path="/admin/*" element={<Main />}>
               <Route index element={<Navigate to="/admin/dashboard" />} /> {/* Điều hướng mặc định */}
               <Route path="dashboard" element={<Home />} />
               <Route path="tables" element={<Tables />} />
               <Route path="billing" element={<Billing />} />
               <Route path="rtl" element={<Rtl />} />
               <Route path="profile" element={<Profile />} />
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
