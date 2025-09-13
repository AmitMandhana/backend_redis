"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, Button, Tag, Space, Typography, Row, Col, Statistic, Progress, message, Spin } from "antd";
import { 
  MailOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface Campaign {
  _id: string;
  name: string;
  message: string;
  intent?: string;
  status: 'draft' | 'queued' | 'processing' | 'sending' | 'sent' | 'partial_failed' | 'failed';
  createdAt: string;
  sentAt?: string;
  totalCount?: number;
  deliveredCount?: number;
  failedCount?: number;
  queuedAt?: string;
  processingStartedAt?: string;
  stats?: {
    sent: number;
    failed: number;
    queued: number;
  };
  totalProcessed?: number;
  successRate?: number;
}

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingCampaignId, setSendingCampaignId] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
    setLoading(true);
      const token = sessionStorage.getItem('googleIdToken');
      if (!token) {
        message.error('Authentication required');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/status/campaigns`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setCampaigns(data.response.campaigns || []);
      } else {
        message.error('Failed to fetch campaigns');
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      message.error('An error occurred while fetching campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchCampaigns, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [fetchCampaigns]);

  const handleSendCampaign = async (campaignId: string) => {
    try {
    setSendingCampaignId(campaignId);
    message.loading({ content: 'Dispatching campaign...', key: 'dispatching' });

      const token = sessionStorage.getItem('googleIdToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/campaigns/queue/${campaignId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
    message.success({ content: 'Campaign dispatch initiated successfully!', key: 'dispatching', duration: 2 });
        fetchCampaigns(); // Refresh the list
      } else {
        message.error({ content: data.message || 'Failed to dispatch campaign', key: 'dispatching', duration: 3 });
      }
    } catch (error) {
      console.error('Error dispatching campaign:', error);
      message.error({ content: 'An error occurred while dispatching campaign', key: 'dispatching', duration: 3 });
    } finally {
    setSendingCampaignId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'default';
      case 'queued': return 'processing';
      case 'processing': return 'processing';
      case 'sending': return 'processing'; 
      case 'sent': return 'success';
      case 'partial_failed': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <ClockCircleOutlined />;
      case 'queued': return <ClockCircleOutlined />;
      case 'processing': return <PlayCircleOutlined />;
      case 'sending': return <PlayCircleOutlined />;
      case 'sent': return <CheckCircleOutlined />;
      case 'partial_failed': return <ExclamationCircleOutlined />;
      case 'failed': return <ExclamationCircleOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getProgressPercent = (campaign: Campaign) => {
    if (!campaign.totalCount || campaign.totalCount === 0) return 0;
    const processed = campaign.totalProcessed || (campaign.deliveredCount || 0) + (campaign.failedCount || 0);
    return Math.round((processed / campaign.totalCount) * 100);
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-lg text-gray-600">Loading campaigns...</div>
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
            Campaign Management
          </Title>
          <Text className="text-lg text-gray-600">
            Monitor and manage your email campaigns with real-time status updates
          </Text>
        </div>

        {/* Stats Overview */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={8}>
            <Card className="text-center shadow-lg border-0">
              <Statistic
                title="Total Campaigns"
                value={campaigns.length}
                prefix={<MailOutlined className="text-blue-500" />}
                valueStyle={{ color: '#1f2937' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center shadow-lg border-0">
              <Statistic
                title="Active Campaigns"
                value={campaigns.filter(c => ['queued', 'processing', 'sending'].includes(c.status)).length}
                prefix={<PlayCircleOutlined className="text-green-500" />}
                valueStyle={{ color: '#1f2937' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="text-center shadow-lg border-0">
              <Statistic
                title="Completed"
                value={campaigns.filter(c => ['sent', 'partial_failed'].includes(c.status)).length}
                prefix={<CheckCircleOutlined className="text-purple-500" />}
                valueStyle={{ color: '#1f2937' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Campaigns List */}
        <Row gutter={[24, 24]}>
          {campaigns.map((campaign) => (
            <Col xs={24} lg={12} xl={8} key={campaign._id}>
              <Card
                className="h-full shadow-lg hover:shadow-xl transition-shadow duration-300 border-0"
                title={
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-semibold text-gray-800">{campaign.name}</span>
                    <Tag color={getStatusColor(campaign.status)} icon={getStatusIcon(campaign.status)}>
                      {campaign.status.toUpperCase()}
                    </Tag>
                  </div>
                }
              >
                <div className="space-y-4">
                  {/* Campaign Message Preview and Send Button */}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Text className="text-sm text-gray-500">Message:</Text>
                        <div className="mt-1 p-3 bg-gray-50 rounded-lg overflow-x-auto">
                          <Text className="text-sm text-gray-700">
                            {campaign.message.length > 100 
                              ? `${campaign.message.substring(0, 100)}...` 
                              : campaign.message
                            }
                          </Text>
                        </div>
                      </div>
                      {campaign.status === 'draft' && (
                        <div className="flex-shrink-0 mt-2 sm:mt-0 ml-0 sm:ml-2">
                          <Button
                            type="primary"
                            size="small"
                            loading={sendingCampaignId === campaign._id}
                            onClick={() => handleSendCampaign(campaign._id)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0"
                          >
                            Send Campaign
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {campaign.status !== 'draft' && campaign.totalCount && (
                    <div>
                      <div className="flex justify-between mb-2">
                        <Text className="text-sm text-gray-500">Progress</Text>
                        <Text className="text-sm font-semibold">
                          {getProgressPercent(campaign)}%
                        </Text>
                      </div>
                      <Progress 
                        percent={getProgressPercent(campaign)} 
                        strokeColor="#3b82f6"
                        trailColor="#e5e7eb"
                      />
                    </div>
                  )}

                  {/* Statistics */}
                  {campaign.totalCount && (
                    <Row gutter={16}>
                      <Col span={8}>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">{campaign.totalCount}</div>
                          <div className="text-xs text-gray-500">Total</div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{campaign.stats?.sent || campaign.deliveredCount || 0}</div>
                          <div className="text-xs text-gray-500">Sent</div>
                        </div>
                      </Col>
                      <Col span={8}>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-500">{campaign.stats?.failed || campaign.failedCount || 0}</div>
                          <div className="text-xs text-gray-500">Failed</div>
                        </div>
                      </Col>
                    </Row>
                  )}

                  {/* Success Rate */}
                  {campaign.successRate !== undefined && campaign.successRate > 0 && (
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-1">
                        <Text className="text-xs text-gray-500">Success Rate</Text>
                        <Text className="text-xs font-semibold text-green-600">
                          {campaign.successRate.toFixed(1)}%
                        </Text>
                      </div>
                      <Progress 
                        percent={campaign.successRate} 
                        size="small"
                        strokeColor="#10b981"
                        trailColor="#e5e7eb"
                        showInfo={false}
                      />
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Created: {dayjs(campaign.createdAt).format('MMM DD, YYYY')}</span>
                      {campaign.sentAt && (
                        <span>Sent: {dayjs(campaign.sentAt).format('MMM DD, YYYY')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {campaigns.length === 0 && (
          <Card className="text-center shadow-lg border-0">
            <div className="py-12">
              <MailOutlined className="text-6xl text-gray-300 mb-4" />
              <Title level={3} className="text-gray-500">No campaigns found</Title>
              <Text className="text-gray-400">Create your first campaign to get started</Text>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CampaignsPage;