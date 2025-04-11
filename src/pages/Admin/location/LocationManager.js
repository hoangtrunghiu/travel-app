import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Space, Popconfirm, Modal, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SearchTable from '@/utils/searchTable';
import {
   getAllDestinations,
   getAllDeparturePoints,
   deleteDestination,
   deleteDeparturePoint,
   flattenDestinations,
} from '@/services/locationService';
import DestinationForm from '@/components/Admin/Form/DestinationForm';
import DeparturePointForm from '@/components/Admin/Form/DeparturePointForm';
import { useNotify } from '@/utils/notify';

export default function LocationManager() {
   const { getColumnSearchProps } = SearchTable();
   const [destinations, setDestinations] = useState([]);
   const [isModalOpenDestination, setIsModalOpenDestination] = useState(false);
   const [editingDestination, setEditingDestination] = useState(null); // Lưu menu đang chỉnh sửa

   const [departurePoints, setDeparturePoints] = useState([]);
   const [isModalOpenDeparturePoint, setIsModalOpenDeparturePoint] = useState(false);
   const [editingDeparturePoint, setEditingDeparturePoint] = useState(null); // Lưu menu đang chỉnh sửa
   const { notifySuccess, contextHolder } = useNotify();

   useEffect(() => {
      fetchAllDestination();
      fetchAllDeparturePoint();
   }, []);

   const fetchAllDestination = async () => {
      try {
         const data = await getAllDestinations();
         const flatDestinations = flattenDestinations(data); // Chuyển đổi dữ liệu
         setDestinations(flatDestinations);
      } catch (error) {
         console.error('Lỗi khi lấy danh sách địa điểm:', error);
      }
   };
   const fetchAllDeparturePoint = async () => {
      try {
         const data = await getAllDeparturePoints();
         setDeparturePoints(data);
      } catch (error) {
         console.error('Lỗi khi lấy danh sách địa điểm:', error);
      }
   };

   const handleDeleteDestination = async (data) => {
      await deleteDestination(data.id);
      notifySuccess('Xóa thành công', `Địa điểm "${data.name}" đã được xóa.`);
      fetchAllDestination();
   };

   const handleDeleteDeparturePoint = async (data) => {
      await deleteDeparturePoint(data.id);
      notifySuccess('Xóa thành công', `Địa điểm "${data.name}" đã được xóa.`);
      fetchAllDeparturePoint();
   };

   const handleEditDestination = (data) => {
      setEditingDestination(data); // Lưu menu cần chỉnh sửa
      setIsModalOpenDestination(true);
   };

   const handleEditDeparturePoint = (data) => {
      setEditingDeparturePoint(data); // Lưu menu cần chỉnh sửa
      setIsModalOpenDeparturePoint(true);
   };

   const handleCloseModalDestination = () => {
      setIsModalOpenDestination(false);
      setEditingDestination(null);
   };

   const handleCloseModalDeparturePoint = () => {
      setIsModalOpenDeparturePoint(false);
      setEditingDeparturePoint(null);
   };

   const columnsDestination = [
      {
         title: 'Tên địa điểm',
         dataIndex: 'nameFlat',
         key: 'nameFlat',
         ...getColumnSearchProps('nameFlat'),
      },
      {
         title: 'Hành động',
         key: 'actions',
         render: (text, record) => (
            <Space>
               <Button type="link" onClick={() => handleEditDestination(record)}>
                  <EditOutlined /> Sửa
               </Button>
               <Popconfirm
                  title="Bạn có chắc muốn xóa địa điểm này?"
                  onConfirm={() => handleDeleteDestination(record)}
                  okText="Có"
                  cancelText="Không"
               >
                  <Button type="link" danger>
                     <DeleteOutlined />
                     Xóa
                  </Button>
               </Popconfirm>
            </Space>
         ),
      },
   ];
   const columnsDeparturePoint = [
      {
         title: 'Tên địa điểm',
         dataIndex: 'name',
         key: 'name',
         ...getColumnSearchProps('name'),
      },
      {
         title: 'Hành động',
         key: 'actions',
         render: (text, record) => (
            <Space>
               <Button type="link" onClick={() => handleEditDeparturePoint(record)}>
                  <EditOutlined /> Sửa
               </Button>
               <Popconfirm
                  title="Bạn có chắc muốn xóa địa điểm này?"
                  onConfirm={() => handleDeleteDeparturePoint(record)}
                  okText="Có"
                  cancelText="Không"
               >
                  <Button type="link" danger>
                     <DeleteOutlined />
                     Xóa
                  </Button>
               </Popconfirm>
            </Space>
         ),
      },
   ];

   return (
      <>
         {contextHolder}

         <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
               <Card
                  className="header-solid mb-24"
                  title={<h6 className="font-semibold text-lg md:text-xl">Danh sách xuất phát</h6>}
                  extra={
                     <Button type="primary" onClick={() => setIsModalOpenDeparturePoint(true)}>
                        Thêm mới
                     </Button>
                  }
               >
                  <Table
                     dataSource={departurePoints}
                     columns={columnsDeparturePoint}
                     rowKey="id"
                     pagination={{ pageSize: 20 }}
                     scroll={{ x: 'max-content' }}
                  />
               </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
               <Card
                  className="header-solid mb-24"
                  title={<h6 className="font-semibold text-lg md:text-xl">Danh sách điểm đến</h6>}
                  extra={
                     <Button type="primary" onClick={() => setIsModalOpenDestination(true)}>
                        Thêm mới
                     </Button>
                  }
               >
                  <Table
                     dataSource={destinations}
                     columns={columnsDestination}
                     rowKey="id"
                     pagination={{ pageSize: 20 }}
                     scroll={{ x: 'max-content' }}
                  />
               </Card>
            </Col>
         </Row>

         <Modal width="800px" open={isModalOpenDeparturePoint} footer={null} onCancel={handleCloseModalDeparturePoint}>
            <DeparturePointForm
               departurePoint={editingDeparturePoint}
               onSuccess={fetchAllDeparturePoint}
               onClose={handleCloseModalDeparturePoint}
            />
         </Modal>

         <Modal width="800px" open={isModalOpenDestination} footer={null} onCancel={handleCloseModalDestination}>
            <DestinationForm
               destination={editingDestination}
               onSuccess={fetchAllDestination}
               onClose={handleCloseModalDestination}
            />
         </Modal>
      </>
   );
}
