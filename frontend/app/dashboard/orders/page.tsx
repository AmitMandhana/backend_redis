"use client"
import React, { useEffect, useState } from 'react'
import { UploadOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import Papa from 'papaparse';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { Button, message, Upload, Table, Spin, Card, Typography, Row, Col, Statistic } from 'antd';

const { Title, Text } = Typography;

const Page = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [authToken, setAuthToken] = useState<string | null>(null);
    // ...existing code...


    // Dummy data for demo/testing
    useEffect(() => {
        const dummyOrders = [
            {
                _id: '1',
                externalId: 'ORD-1001',
                customerId: 'CUST-001',
                amount: 120.5,
                items: ['Product A', 'Product B'],
                orderDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
            },
            {
                _id: '2',
                externalId: 'ORD-1002',
                customerId: 'CUST-002',
                amount: 75.0,
                items: ['Product C'],
                orderDate: new Date(Date.now() - 86400000).toISOString(),
                createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
                _id: '3',
                externalId: 'ORD-1003',
                customerId: 'CUST-003',
                amount: 200.0,
                items: ['Product D', 'Product E', 'Product F'],
                orderDate: new Date(Date.now() - 2 * 86400000).toISOString(),
                createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            },
        ];
        setOrders(dummyOrders);
    }, []);

    const getAllOrders = async (token: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/getAllOrders`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const data = await response.json();
            if (data.success) {
                setOrders(data.response.orders);
            } else {
                console.error('Error fetching orders:', data.message);
            }
            console.log(data.response.orders);
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
            const required = ['order_external_id', 'customer_identifier', 'items_description', 'total_amount', 'order_date'];
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
        action: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploads/orders`,
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
                    getAllOrders(authToken!);
                }
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    // ...existing code...

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'externalId',
            key: 'externalId',
            render: (text: string) => (
                <span className="font-mono text-blue-600">{text || 'N/A'}</span>
            ),
        },
        {
            title: 'Customer',
            dataIndex: 'customerId',
            key: 'customerId',
            render: (customerId: string) => {
                // In a real app, you'd fetch customer details
                return <span className="text-gray-700">Customer {customerId.slice(-6)}</span>;
            },
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => (
                <span className="font-semibold text-green-600">
                    ${amount.toLocaleString()}
                </span>
            ),
            sorter: (a: any, b: any) => a.amount - b.amount,
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
            render: (items: string[]) => (
                <div>
                    {items && items.length > 0 ? (
                        <span className="text-gray-700">{items.length} items</span>
                    ) : (
                        <span className="text-gray-400">-</span>
                    )}
                </div>
            ),
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (date: string) => (
                <span className="text-gray-600">
                    {new Date(date).toLocaleDateString()}
                </span>
            ),
            sorter: (a: any, b: any) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => (
                <span className="text-gray-500 text-sm">
                    {new Date(date).toLocaleDateString()}
                </span>
            ),
        },
    ];

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    if (loading && orders.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <Spin size="large" />
                    <div className="mt-4 text-lg text-gray-600">Loading orders...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Title level={1} className="!mb-2 !text-4xl !font-bold !text-gray-800">
                        Order Management
                    </Title>
                    <Text className="text-lg text-gray-600">
                        Track and manage customer orders and revenue
                    </Text>
                </div>

                {/* Stats */}
                <Row gutter={[24, 24]} className="mb-8">
                    <Col xs={24} sm={8}>
                        <Card className="text-center shadow-lg border-0">
                            <Statistic
                                title="Total Orders"
                                value={orders.length}
                                prefix={<ShoppingCartOutlined className="text-blue-500" />}
                                valueStyle={{ color: '#1f2937' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="text-center shadow-lg border-0">
                            <Statistic
                                title="Total Revenue"
                                value={totalRevenue}
                                prefix={<DollarOutlined className="text-green-500" />}
                                precision={2}
                                valueStyle={{ color: '#1f2937' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card className="text-center shadow-lg border-0">
                            <Statistic
                                title="Average Order Value"
                                value={averageOrderValue}
                                prefix={<DollarOutlined className="text-purple-500" />}
                                precision={2}
                                valueStyle={{ color: '#1f2937' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Upload & Add Order Section */}
                <Card className="mb-8 shadow-lg border-0">
                    <div className="text-center">
                        <UploadOutlined className="text-4xl text-blue-500 mb-4" />
                        <Title level={3} className="!mb-2">Import Orders from CSV</Title>
                        <Text className="text-gray-600 mb-6 block">
                            Upload a CSV file to import multiple orders at once
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
                            <span className="font-semibold">CSV format:</span> order_external_id, customer_identifier, items_description, total_amount, order_date
                        </div>
                        {/* Removed manual add order button */}
                    </div>
                </Card>

                {/* Orders Table */}
                <Card 
                    title={
                        <div className="flex items-center">
                            <ShoppingCartOutlined className="mr-2 text-blue-500" />
                            <span className="text-lg font-semibold">Order List</span>
                        </div>
                    }
                    className="shadow-lg border-0"
                >
                    <Table
                        columns={columns}
                        dataSource={orders}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => 
                                `${range[0]}-${range[1]} of ${total} orders`,
                        }}
                        className="custom-table"
                    />
                </Card>
                {/* Removed manual add order modal */}
            </div>
        </div>
    );
}

export default Page;