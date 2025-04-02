import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
   // Lấy thông tin user từ localStorage
   const userData = JSON.parse(localStorage.getItem('user'));

   // Kiểm tra nếu không có user hoặc role không chứa "Administrator"
   if (!userData || !userData.roles.includes('Administrator')) {
      return <Navigate to="/login" replace />;
   }

   return <Outlet />;
};

export default ProtectedRoute;
