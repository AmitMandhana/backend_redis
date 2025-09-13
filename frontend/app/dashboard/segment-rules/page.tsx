"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, message, Card, Typography, Row, Col, Space, Tag, List } from "antd";
import { PlusOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [segmentRules, setSegmentRules] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSegmentRules();
  }, []);

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
        setSegmentRules(data.response.segmentRules || []);
      }
    } catch (error) {
      console.error("Error fetching segment rules:", error);
    }
  };

  const handleSubmit = async (values: any) => {
    console.log("Form Values:", values);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/segmentRules/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("googleIdToken")}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (data.success) {
        message.success("Segment rule created successfully!");
        form.resetFields();
        fetchSegmentRules();
      } else {
        message.error("Failed to create segment rule.");
      }
    } catch (error) {
      console.error("Error creating segment rule:", error);
      message.error("An error occurred while creating the segment rule.");
    }

    setLoading(false);
  };

  const formatCondition = (condition: any) => {
    return `${condition.field} ${condition.op} ${condition.value}`;
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Title level={1} className="!mb-2 !text-4xl !font-bold !text-gray-800">
            Segment Rules Management
          </Title>
          <Text className="text-lg text-gray-600">
            Create intelligent customer segments for targeted campaigns
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Create Segment Rule Form */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center">
                  <PlusOutlined className="mr-2 text-blue-500" />
                  <span className="text-lg font-semibold">Create New Segment Rule</span>
                </div>
              }
              className="shadow-lg border-0 h-fit"
              bodyStyle={{ maxHeight: 600, overflowY: 'auto', overflowX: 'hidden' }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
              >
                <Form.Item
                  label={<span className="font-semibold text-gray-700">Logic Type</span>}
                  name="logicType"
                  rules={[{ required: true, message: "Please select a logic type" }]}
                >
                  <Select 
                    size="large"
                    placeholder="Select logic type"
                  >
                    <Option value="AND">
                      <div>
                        <div className="font-semibold">AND Logic</div>
                        <div className="text-sm text-gray-500">All conditions must be true</div>
                      </div>
                    </Option>
                    <Option value="OR">
                      <div>
                        <div className="font-semibold">OR Logic</div>
                        <div className="text-sm text-gray-500">Any condition can be true</div>
                      </div>
                    </Option>
                  </Select>
                </Form.Item>

                <Form.List name="conditions">
                  {(fields, { add, remove }) => (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">Conditions</span>
                        <Button 
                          type="dashed" 
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                          className="border-blue-300 text-blue-600 hover:border-blue-400"
                        >
                          Add Condition
                        </Button>
                      </div>

                      {fields.map(({ key, name, ...restField }) => (
                        <Card key={key} size="small" className="bg-gray-50 border-gray-200">
                          <Row gutter={12} align="middle">
                            <Col xs={24} sm={8}>
                              <Form.Item
                                {...restField}
                                name={[name, "field"]}
                                rules={[{ required: true, message: "Please enter a field" }]}
                                className="mb-0"
                              >
                                <Input 
                                  placeholder="Field (e.g., spend, visits)" 
                                  size="large"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={6}>
                              <Form.Item
                                {...restField}
                                name={[name, "op"]}
                                rules={[{ required: true, message: "Please enter an operator" }]}
                                className="mb-0"
                              >
                                <Select 
                                  placeholder="Operator" 
                                  size="large"
                                >
                                  <Option value=">">Greater than (&gt;)</Option>
                                  <Option value="<">Less than (&lt;)</Option>
                                  <Option value="=">Equals (=)</Option>
                                  <Option value=">=">Greater or equal (&gt;=)</Option>
                                  <Option value="<=">Less or equal (&lt;=)</Option>
                                  <Option value="!=">Not equal (!=)</Option>
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={8}>
                              <Form.Item
                                {...restField}
                                name={[name, "value"]}
                                rules={[{ required: true, message: "Please enter a value" }]}
                                className="mb-0"
                              >
                                <Input 
                                  placeholder="Value (e.g., 10000, 3)" 
                                  size="large"
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={2}>
                              <Button 
                                type="text" 
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => remove(name)}
                                size="large"
                              />
                            </Col>
                          </Row>
                        </Card>
                      ))}
                    </div>
                  )}
                </Form.List>

                <Form.Item className="mb-0">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    size="large"
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 border-0 h-12 text-lg font-semibold"
                  >
                    Create Segment Rule
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Existing Segment Rules */}
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="flex items-center">
                  <FilterOutlined className="mr-2 text-blue-500" />
                  <span className="text-lg font-semibold">Existing Segment Rules</span>
                </div>
              }
              className="shadow-lg border-0"
              bodyStyle={{ maxHeight: 600, overflowY: 'auto', overflowX: 'hidden' }}
            >
              {segmentRules.length > 0 ? (
                <List
                  dataSource={segmentRules}
                  renderItem={(rule) => (
                    <List.Item className="border-b border-gray-100 last:border-b-0">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-2">
                          <Tag color={rule.logicType === 'AND' ? 'blue' : 'green'}>
                            {rule.logicType} Logic
                          </Tag>
                          <Text className="text-sm text-gray-500">
                            {new Date(rule.createdAt).toLocaleDateString()}
                          </Text>
                        </div>
                        <div className="space-y-1 overflow-x-auto max-w-full">
                          <div className="flex flex-wrap gap-2">
                            {rule.conditions.map((condition: any, index: number) => (
                              <span key={index} className="inline-block text-sm text-gray-700 whitespace-nowrap bg-gray-100 rounded px-2 py-1 mr-1 mb-1">
                                <span className="font-medium">{condition.field}</span>
                                <span className="mx-2 text-gray-500">{condition.op}</span>
                                <span className="text-blue-600">{condition.value}</span>
                                {index < rule.conditions.length - 1 && (
                                  <span className="ml-2 text-gray-400 font-medium">
                                    {rule.logicType}
                                  </span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : (
                <div className="text-center py-8">
                  <FilterOutlined className="text-4xl text-gray-300 mb-4" />
                  <Text className="text-gray-500">No segment rules created yet</Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Help Section */}
        <Card className="mt-8 shadow-lg border-0">
          <Title level={4} className="!mb-4">How to Create Segment Rules</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <Title level={5}>Choose Logic Type</Title>
                <Text className="text-gray-600">
                  AND: All conditions must be true<br/>
                  OR: Any condition can be true
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="text-3xl mb-2">📊</div>
                <Title level={5}>Define Conditions</Title>
                <Text className="text-gray-600">
                  Set field, operator, and value<br/>
                  e.g., spend &gt; 10000
                </Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="text-3xl mb-2">🚀</div>
                <Title level={5}>Use in Campaigns</Title>
                <Text className="text-gray-600">
                  Apply rules to target<br/>
                  specific customer segments
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
      </div>
     </>
   );
};

export default Page;