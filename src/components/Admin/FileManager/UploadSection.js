import React, { useState } from 'react';
import { Upload, Select, Row, Col } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const UploadSection = ({ handleUpload, handleBatchUpload, folders }) => {
   const [selectedFolder, setSelectedFolder] = useState(null);

   return (
      <div className="upload-container">
         <Row gutter={[24, 0]}>
            <Col span={12}>
               <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">Tải lên file</h2>
               </div>
            </Col>
            <Col span={12}>
               {/* Select chọn thư mục */}
               <div className="mb-4 flex justify-end">
                  <Select style={{ width: 250 }} placeholder="Chọn thư mục" onChange={setSelectedFolder} allowClear>
                     <Select.Option value={null}>Thư mục gốc</Select.Option>
                     {folders.map((folder) => (
                        <Select.Option key={folder.id} value={folder.id}>
                           {folder.name}
                        </Select.Option>
                     ))}
                  </Select>
               </div>
            </Col>
         </Row>

         <div className="upload-area">
            <Dragger
               name="file"
               multiple={true}
               customRequest={(options) => handleUpload(options, selectedFolder)}
               onChange={handleBatchUpload}
               showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
            >
               <p className="ant-upload-drag-icon">
                  <InboxOutlined />
               </p>
               <p className="ant-upload-text">Nhấp hoặc kéo file vào khu vực này để tải lên</p>
               <p className="ant-upload-hint">Hỗ trợ tải lên một hoặc nhiều file cùng lúc.</p>
            </Dragger>
         </div>
      </div>
   );
};

export default UploadSection;
