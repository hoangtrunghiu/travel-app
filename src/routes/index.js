import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "@/components/Admin/AdminLayout";
import UserLayout from "@/components/User/Layout";
// import Dashboard from "../pages/Admin/Dashboard";
// import Users from "../pages/Admin/Users";
// import Orders from "../pages/Admin/Orders";
// import Home from "../pages/User/Home";
// import Profile from "../pages/User/Profile";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Layout Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} /> */}
          {/* <Route path="orders" element={<Orders />} /> */}
        </Route>

        {/* Layout User */}
        <Route path="/" element={<UserLayout />}>
          {/* <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} /> */}
          {/* <Route path="orders" element={<Orders />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
