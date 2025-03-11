import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider collapsible style={{ height: "100vh" }}>
      <div
        className="logo"
        style={{ color: "white", textAlign: "center", padding: "20px" }}
      >
        User Panel
      </div>
      <Menu theme="dark" mode="inline">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="profile" icon={<ProfileOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
        <Menu.Item key="orders" icon={<ShoppingCartOutlined />}>
          <Link to="/orders">Orders</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
