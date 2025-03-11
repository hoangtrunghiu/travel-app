import { Layout } from 'antd';

const { Header } = Layout;

const AdminHeader = () => {
    return (
        <Header style={{ background: '#fff', padding: 16 }}>
            <h2 style={{ fontFamily: 'Bai Jamjuree' }}>Admin Dashboard</h2>
        </Header>
    );
};

export default AdminHeader;
