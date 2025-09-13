"use client"
import React, { useEffect, useState } from 'react'
import useIsMobile from '../hooks/useMobile';
import useAuthStore from '../store/useAuthStore';
import { useRouter } from 'next/navigation';
import '@ant-design/v5-patch-for-react-19';
import { Spin, Card, Row, Col, Statistic, Progress, Typography, Space, Button } from 'antd';
import { 
  UserOutlined, 
  ShoppingCartOutlined, 
  MailOutlined, 
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Page = () => {
    const isMobile = useIsMobile();
    const { isLoggedIn, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      const token = sessionStorage.getItem('googleIdToken');
      if (!isLoggedIn && token) {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          useAuthStore.setState({
            isLoggedIn: true,
            user: JSON.parse(storedUser),
          });
        }
      } else if (!token) {
        router.push('/');
      }
    }, []);

    if (isMobile) {
      return (
        <div className="h-screen flex items-center px-10 justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 text-xl">
          <div className="text-center">
            <div className="text-6xl mb-4">📱</div>
            <div>Please switch to a desktop device for the best AMIT CRM experience.</div>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className='h-screen flex items-center px-10 justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-4 text-lg text-gray-600">Loading AMIT CRM Management...</div>
          </div>
        </div>
      );
    }

    return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6'>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Title level={1} className="!mb-2 !text-4xl !font-bold !text-gray-800">
                  Welcome to AMIT CRM Management
                </Title>
                <Text className="text-lg text-gray-600">
                  Hello, {user.name}! Here's your business overview.
                </Text>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Logged in as</div>
                  <div className="font-semibold text-gray-800">{user.email}</div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-white text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
                <Statistic
                  title={<span className="text-gray-600">Total Customers</span>}
                  value={1247}
                  prefix={<UserOutlined className="text-blue-500" />}
                  suffix={<ArrowUpOutlined className="text-green-500" />}
                  valueStyle={{ color: '#1f2937', fontSize: '28px', fontWeight: 'bold' }}
                />
                <div className="mt-2">
                  <Text type="secondary" className="text-sm">+12% from last month</Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
                <Statistic
                  title={<span className="text-gray-600">Active Campaigns</span>}
                  value={8}
                  prefix={<MailOutlined className="text-green-500" />}
                  suffix={<ArrowUpOutlined className="text-green-500" />}
                  valueStyle={{ color: '#1f2937', fontSize: '28px', fontWeight: 'bold' }}
                />
                <div className="mt-2">
                  <Text type="secondary" className="text-sm">+3 this week</Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
                <Statistic
                  title={<span className="text-gray-600">Total Orders</span>}
                  value={3456}
                  prefix={<ShoppingCartOutlined className="text-orange-500" />}
                  suffix={<ArrowUpOutlined className="text-green-500" />}
                  valueStyle={{ color: '#1f2937', fontSize: '28px', fontWeight: 'bold' }}
                />
                <div className="mt-2">
                  <Text type="secondary" className="text-sm">+8% from last month</Text>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
                <Statistic
                  title={<span className="text-gray-600">Revenue</span>}
                  value={125430}
                  prefix={<TrophyOutlined className="text-yellow-500" />}
                  suffix={<ArrowUpOutlined className="text-green-500" />}
                  valueStyle={{ color: '#1f2937', fontSize: '28px', fontWeight: 'bold' }}
                />
                <div className="mt-2">
                  <Text type="secondary" className="text-sm">+15% from last month</Text>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row gutter={[24, 24]} className="mb-8">
            <Col xs={24} lg={16}>
              <Card title="Quick Actions" className="shadow-lg border-0">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<PlusOutlined />}
                      className="w-full h-16 bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:from-blue-600 hover:to-indigo-700"
                      onClick={() => router.push('/dashboard/campaign')}
                    >
                      Create Campaign
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Button 
                      size="large" 
                      icon={<UserOutlined />}
                      className="w-full h-16"
                      onClick={() => router.push('/dashboard/customers')}
                    >
                      Manage Customers
                    </Button>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Button 
                      size="large" 
                      icon={<MailOutlined />}
                      className="w-full h-16"
                      onClick={() => router.push('/dashboard/campaigns')}
                    >
                      View Campaigns
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
            
            <Col xs={24} lg={8}>
              <Card title="Campaign Performance" className="shadow-lg border-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Text>Email Open Rate</Text>
                      <Text strong>78%</Text>
                    </div>
                    <Progress percent={78} strokeColor="#10b981" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <Text>Click Through Rate</Text>
                      <Text strong>24%</Text>
                    </div>
                    <Progress percent={24} strokeColor="#3b82f6" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <Text>Conversion Rate</Text>
                      <Text strong>12%</Text>
                    </div>
                    <Progress percent={12} strokeColor="#f59e0b" />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Recent Activity */}
          <Card title="Recent Activity" className="shadow-lg border-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MailOutlined className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">Campaign "Summer Sale" sent successfully</div>
                  <div className="text-sm text-gray-500">1,247 emails delivered • 2 minutes ago</div>
                </div>
                <div className="text-green-600 font-semibold">+12%</div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserOutlined className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">New customer segment created</div>
                  <div className="text-sm text-gray-500">"High Value Customers" • 1 hour ago</div>
                </div>
                <div className="text-blue-600 font-semibold">+45 customers</div>
              </div>
              
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <ShoppingCartOutlined className="text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">New orders imported</div>
                  <div className="text-sm text-gray-500">CSV upload completed • 3 hours ago</div>
                </div>
                <div className="text-orange-600 font-semibold">+156 orders</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
}

export default Page;