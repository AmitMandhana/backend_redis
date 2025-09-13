"use client"
import React, { useEffect, useState } from 'react'
import { UploadOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload, Table, Spin, Card, Typography, Row, Col, Statistic, Space } from 'antd';
import Papa from 'papaparse';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { Modal, Form, Input } from 'antd';

const { Title, Text } = Typography;

const Page = () => {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const token = sessionStorage.getItem('googleIdToken');
        if (token) {
            setAuthToken(token);
            getAllCustomers(token);
        } else {
            console.error('No auth token found');
        }
    }, []);

    const getAllCustomers = async (token: string) => {
        try {
            setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/getAllCustomers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        if (data.success && data.response && Array.isArray(data.response.customers)) {
            setCustomers(data.response.customers);
        } else {
            const message = data?.response?.message || data?.response || 'Unknown error';
            console.error('Error fetching customers:', message);
        }
        console.log(data);
        setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }

            const beforeUpload = (file: RcFile, _fileList: UploadFile[]) => {
                return new Promise<Blob | boolean>((resolve, reject) => {
                    Papa.parse(file, {
                        header: true,
                        complete: (results: Papa.ParseResult<any>) => {
                            const required = ['name', 'email'];
                            const headers = results.meta.fields || [];
                            const missing = required.filter(r => !headers.includes(r));
                            if (missing.length > 0) {
                                message.error(`CSV missing required columns: ${missing.join(', ')}`);
                                reject(false);
                            } else {
                                resolve(true);
                            }
                        },
                        error: () => {
                            message.error('Failed to parse CSV.');
                            reject(false);
                        }
                    });
                });
            };

        const props: UploadProps = {
            name: 'file',
            action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploads/customers`,
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
            beforeUpload,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    if (info.file.response && info.file.response.success === false) {
                        message.error(info.file.response.message || 'Upload failed.');
                    } else {
                        message.success(`${info.file.name} file uploaded successfully`);
                        getAllCustomers(authToken!);
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };

    const handleAddCustomer = async (values: any) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/createOrUpdate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
            },
                body: JSON.stringify(values)
          });

            const data = await response.json();
          if (data.success) {
                message.success('Customer added successfully!');
            setIsModalOpen(false);
            form.resetFields();
                getAllCustomers(authToken!);
          } else {
                message.error(data.message || 'Failed to add customer');
            }
        } catch (error) {
            console.error('Error adding customer:', error);
            message.error('An error occurred while adding customer');
        }
    };
      
      const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => (
                <div className="flex items-center">
                    <UserOutlined className="mr-2 text-blue-500" />
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text: string) => (
                <span className="text-blue-600">{text}</span>
            ),
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (text: string) => text || '-',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (text: string) => text || '-',
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
    ];

    if (loading && customers.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <Spin size="large" />
                    <div className="mt-4 text-lg text-gray-600">Loading customers...</div>
                </div>
            </div>
        );
    }

  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Title level={1} className="!mb-2 !text-4xl !font-bold !text-gray-800">
                                Customer Management
                            </Title>
                            <Text className="text-lg text-gray-600">
                                Manage your customer database and import new customers
                            </Text>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0"
                        >
                            Add Customer
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <Row gutter={[24, 24]} className="mb-8">
                    <Col xs={24} sm={8}>
                        <Card className="text-center shadow-lg border-0">
                            <Statistic
                                title="Total Customers"
                                value={customers.length}
                                prefix={<UserOutlined className="text-blue-500" />}
                                valueStyle={{ color: '#1f2937' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="text-center shadow-lg border-0">
                            <Statistic
                                title="With Phone Numbers"
                                value={customers.filter(c => c.phone).length}
                                prefix={<UserOutlined className="text-green-500" />}
                                valueStyle={{ color: '#1f2937' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="text-center shadow-lg border-0">
                            <Statistic
                                title="With Locations"
                                value={customers.filter(c => c.location).length}
                                prefix={<UserOutlined className="text-purple-500" />}
                                valueStyle={{ color: '#1f2937' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Upload Section */}
                <Card className="mb-8 shadow-lg border-0">
                    <div className="text-center">
                        <UploadOutlined className="text-4xl text-blue-500 mb-4" />
                        <Title level={3} className="!mb-2">Import Customers from CSV</Title>
                        <Text className="text-gray-600 mb-6 block">
                            Upload a CSV file to import multiple customers at once
                        </Text>
                        <Upload {...props} className="inline-block" accept=".csv">
                            <Button 
                                size="large" 
                                icon={<UploadOutlined />}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 border-0"
                            >
                                Click to Upload CSV
                            </Button>
  </Upload>
                        <div className="mt-4 text-sm text-gray-500">
                            CSV format: name, email, phone, location
                        </div>
        </div>
                </Card>

                {/* Customers Table */}
                <Card 
                    title={
                        <div className="flex items-center">
                            <UserOutlined className="mr-2 text-blue-500" />
                            <span className="text-lg font-semibold">Customer List</span>
          </div>
                    }
                    className="shadow-lg border-0"
                >
          <Table
            columns={columns}
            dataSource={customers}
            rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => 
                                `${range[0]}-${range[1]} of ${total} customers`,
                        }}
                        className="custom-table"
                    />
                </Card>

                {/* Add Customer Modal */}
      <Modal
                    title="Add New Customer"
        open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                        form.resetFields();
                    }}
                    footer={null}
                    className="custom-modal"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleAddCustomer}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please enter customer name' }]}
                        >
                            <Input placeholder="Enter customer name" />
          </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter email' },
                                { type: 'email', message: 'Please enter valid email' }
                            ]}
                        >
                            <Input placeholder="Enter email address" />
          </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                        >
                            <Input placeholder="Enter phone number" />
          </Form.Item>

                        <Form.Item
                            label="Location"
                            name="location"
                        >
                            <Input placeholder="Enter location" />
          </Form.Item>

                        <Form.Item className="mb-0">
                            <Space className="w-full justify-end">
                                <Button onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    Add Customer
                                </Button>
                            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
        </div>
    );
}

export default Page;