"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message, Card, Typography, Row, Col, Space, Divider } from "antd";
import { BsStars } from "react-icons/bs";
import { MailOutlined, UserOutlined, SendOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

const Page = () => {
  const [segmentRules, setSegmentRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [aiGenerating, setAiGenerating] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchSegmentRules = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/segmentRules/getAllSegmentRules`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("googleIdToken")}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setSegmentRules(data.response.segmentRules);
        } else {
          message.error("Failed to fetch segment rules.");
        }
      } catch (error) {
        console.error("Error fetching segment rules:", error);
        message.error("An error occurred while fetching segment rules.");
      }
    };

    fetchSegmentRules();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/customers/getAllCustomers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("googleIdToken")}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setCustomers(data.response.customers);
        } else {
          message.error("Failed to fetch customers.");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        message.error("An error occurred while fetching customers.");
      }
    };

    fetchCustomers();
  }, []);
  
  const handleRuleChange = (ruleId: string) => {
    setSelectedRule(ruleId);
    setSelectedCustomers([]); // Clear selection on rule change
  };

  const generateAIMessage = async () => {
    if (!form.getFieldValue('name') || !selectedRule) {
      message.warning('Please fill in campaign name and select a segment rule first');
      return;
    }

    try {
      setAiGenerating(true);
      const response = await fetch('/api/generateGeminiMessage', {
        method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          name: form.getFieldValue('name'),
          rule: selectedRule,
      }),
      });

    const data = await response.json();
    if (data.success) {
        form.setFieldsValue({ message: data.message });
        message.success('AI message generated successfully!');
      } else {
        message.error('Failed to generate AI message');
      }
    } catch (error) {
      console.error('Error generating AI message:', error);
      message.error('An error occurred while generating AI message');
    } finally {
      setAiGenerating(false);
    }
  };

  const onFinish = async (values: any) => {
    if (!selectedRule) {
      message.error('Please select a segment rule');
      return;
    }

    if (selectedCustomers.length === 0) {
      message.error('Please select at least one customer');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/campaigns/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("googleIdToken")}`,
        },
        body: JSON.stringify({
          name: values.name,
          message: values.message,
          intent: values.intent,
          ruleId: selectedRule,
          customerIds: selectedCustomers,
        }),
      });

      const data = await response.json();
      if (data.success) {
        message.success("Campaign created successfully!");
        form.resetFields();
        setSelectedRule(null);
        setSelectedCustomers([]);
      } else {
        message.error(data.message || "Failed to create campaign");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      message.error("An error occurred while creating campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Title level={1} className="!mb-2 !text-4xl !font-bold !text-gray-800">
            Create New Campaign
          </Title>
          <Text className="text-lg text-gray-600">
            Design and launch targeted email campaigns with AI-powered messaging
          </Text>
        </div>

        <Card className="shadow-lg border-0">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
          >
            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  label={<span className="font-semibold text-gray-700">Campaign Name</span>}
                  name="name"
                  rules={[{ required: true, message: 'Please enter campaign name' }]}
                >
                  <Input 
                    size="large" 
                    placeholder="Enter campaign name"
                    prefix={<MailOutlined className="text-gray-400" />}
                  />
          </Form.Item>
              </Col>

              <Col xs={24} lg={12}>
          <Form.Item
                  label={<span className="font-semibold text-gray-700">Intent/Purpose</span>}
                  name="intent"
                >
                  <Input 
                    size="large" 
                    placeholder="e.g., Product Launch, Sale Announcement"
                  />
          </Form.Item>
              </Col>
            </Row>

          <Form.Item
              label={<span className="font-semibold text-gray-700">Select Audience Segment</span>}
              rules={[{ required: true, message: 'Please select a segment rule' }]}
          >
            <Select
                size="large"
                placeholder="Choose a segment rule"
                value={selectedRule}
                onChange={handleRuleChange}
                className="w-full"
              >
                {segmentRules.map((rule) => (
                  <Option key={rule._id} value={rule._id}>
                    <div>
                      <div className="font-semibold">{rule.logicType} Logic</div>
                      <div className="text-sm text-gray-500">
                        {rule.conditions.map((condition: any, index: number) => (
                          <span key={index}>
                            {condition.field} {condition.op} {condition.value}
                            {index < rule.conditions.length - 1 && ` ${rule.logicType} `}
                          </span>
                        ))}
                      </div>
                    </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

            {selectedRule && (
              <Card className="bg-blue-50 border-blue-200">
                <div className="mb-2 font-semibold text-blue-800 flex items-center">
                  <UserOutlined className="mr-2" />
                  Selected Audience: {selectedCustomers.length} customers
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Button size="small" onClick={() => setSelectedCustomers(customers.map(c => c._id))}>
                    Select All
                  </Button>
                  <Button size="small" onClick={() => setSelectedCustomers([])}>
                    Clear All
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
                  {customers.length === 0 && <span className="text-gray-400">No customers found</span>}
                  {customers.map((c) => (
                    <label key={c._id} className="flex items-center gap-2 mb-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(c._id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedCustomers(prev => [...prev, c._id]);
                          } else {
                            setSelectedCustomers(prev => prev.filter(id => id !== c._id));
                          }
                        }}
                      />
                      <span>{c.name} <span className="text-xs text-gray-400">({c.email})</span></span>
                    </label>
                  ))}
                </div>
              </Card>
            )}

            <Divider />

          <Form.Item
              label={
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Campaign Message</span>
                  <Button
                    type="dashed"
                    icon={<BsStars />}
                    loading={aiGenerating}
                    onClick={generateAIMessage}
                    className="border-blue-300 text-blue-600 hover:border-blue-400"
                  >
                    Generate with AI
                  </Button>
                </div>
              }
              name="message"
              rules={[{ required: true, message: 'Please enter campaign message' }]}
            >
              <TextArea
                rows={6}
                placeholder="Write your campaign message here..."
                className="resize-none"
              />
          </Form.Item>

            <div className="bg-gray-50 p-4 rounded-lg">
              <Text className="text-sm text-gray-600">
                <strong>Preview:</strong> This message will be sent to {selectedCustomers.length} customers 
                {selectedRule && ' matching your selected segment rule'}.
              </Text>
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<SendOutlined />}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 border-0 hover:from-blue-600 hover:to-indigo-700 h-12 text-lg font-semibold"
              >
              Create Campaign
            </Button>
          </Form.Item>
        </Form>
        </Card>

        {/* Features Info */}
        <Row gutter={24} className="mt-8">
          <Col xs={24} md={8}>
            <Card className="text-center shadow-lg border-0 h-full">
              <div className="text-4xl mb-4">🤖</div>
              <Title level={4} className="!mb-2">AI-Powered Messaging</Title>
              <Text className="text-gray-600">
                Generate compelling campaign messages using advanced AI technology
              </Text>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card className="text-center shadow-lg border-0 h-full">
              <div className="text-4xl mb-4">🎯</div>
              <Title level={4} className="!mb-2">Smart Segmentation</Title>
              <Text className="text-gray-600">
                Target the right audience with intelligent customer segmentation rules
              </Text>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card className="text-center shadow-lg border-0 h-full">
              <div className="text-4xl mb-4">📊</div>
              <Title level={4} className="!mb-2">Real-time Analytics</Title>
              <Text className="text-gray-600">
                Track campaign performance with live delivery and engagement metrics
              </Text>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Page;