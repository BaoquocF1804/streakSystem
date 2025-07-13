import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  DatePicker,
  Row,
  Col,
  Statistic,
  Progress,
  Popconfirm,
  Tooltip,
  message,
  Divider,
  List,
  Avatar,
  Badge,
  Transfer
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  ReloadOutlined,
  GiftOutlined,
  SendOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../stores/adminStore';
import { AdminVoucher, AdminUser } from '../../types/admin';
import type { ColumnsType } from 'antd/es/table';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const VoucherManagement: React.FC = () => {
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<AdminVoucher | null>(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<AdminVoucher | null>(null);
  const [distributeModalVisible, setDistributeModalVisible] = useState(false);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [form] = Form.useForm();

  const {
    vouchers,
    users,
    loading,
    filters,
    fetchVouchers,
    fetchUsers,
    createVoucher,
    updateVoucher,
    deleteVoucher,
    distributeVoucher,
    setFilter,
    clearFilter
  } = useAdminStore();

  useEffect(() => {
    fetchVouchers();
    fetchUsers();
  }, []);

  const handleCreateVoucher = () => {
    setEditingVoucher(null);
    setVoucherModalVisible(true);
    form.resetFields();
  };

  const handleEditVoucher = (voucher: AdminVoucher) => {
    setEditingVoucher(voucher);
    setVoucherModalVisible(true);
    form.setFieldsValue({
      ...voucher,
      dateRange: [voucher.startDate, voucher.endDate]
    });
  };

  const handleDeleteVoucher = async (voucherId: string) => {
    await deleteVoucher(voucherId);
    fetchVouchers(filters);
  };

  const handleSubmitVoucher = async (values: any) => {
    try {
      const voucherData = {
        ...values,
        startDate: values.dateRange?.[0],
        endDate: values.dateRange?.[1]
      };

      if (editingVoucher) {
        await updateVoucher(editingVoucher.id, voucherData);
      } else {
        await createVoucher(voucherData);
      }

      setVoucherModalVisible(false);
      form.resetFields();
      fetchVouchers(filters);
    } catch (error) {
      message.error('Failed to save voucher');
    }
  };

  const handlePreviewVoucher = (voucher: AdminVoucher) => {
    setSelectedVoucher(voucher);
    setPreviewModalVisible(true);
  };

  const handleDistributeVoucher = (voucher: AdminVoucher) => {
    setSelectedVoucher(voucher);
    setDistributeModalVisible(true);
    setTargetKeys([]);
  };

  const handleSubmitDistribution = async () => {
    if (selectedVoucher && targetKeys.length > 0) {
      await distributeVoucher(selectedVoucher.id, targetKeys);
      setDistributeModalVisible(false);
      setTargetKeys([]);
      fetchVouchers(filters);
    }
  };

  const getStatusColor = (status: AdminVoucher['status']) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'orange';
      case 'expired': return 'red';
      default: return 'default';
    }
  };

  const getTypeColor = (type: AdminVoucher['type']) => {
    switch (type) {
      case 'discount': return 'blue';
      case 'cashback': return 'green';
      case 'freebie': return 'purple';
      case 'points': return 'gold';
      default: return 'default';
    }
  };

  const getUsageRate = (voucher: AdminVoucher) => {
    return voucher.maxUses > 0 ? (voucher.usedCount / voucher.maxUses) * 100 : 0;
  };

  const isExpired = (voucher: AdminVoucher) => {
    return new Date(voucher.endDate) < new Date();
  };

  const columns: ColumnsType<AdminVoucher> = [
    {
      title: 'Voucher',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: AdminVoucher) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">{record.code}</div>
        </div>
      )
    },
    {
      title: 'Value',
      key: 'value',
      render: (_, record: AdminVoucher) => (
        <div className="flex items-center space-x-1">
          {record.type === 'discount' || record.type === 'cashback' ? (
            <DollarOutlined className="text-green-500" />
          ) : (
            <GiftOutlined className="text-blue-500" />
          )}
          <span className="font-medium">
            {record.valueType === 'percentage' ? `${record.value}%` : record.value.toLocaleString()}
            {record.type === 'discount' && record.valueType === 'fixed' && 'đ'}
            {record.type === 'points' && ' pts'}
          </span>
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: AdminVoucher['type']) => (
        <Tag color={getTypeColor(type)}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AdminVoucher['status'], record: AdminVoucher) => {
        const expired = isExpired(record);
        const actualStatus = expired ? 'expired' : status;
        return (
          <Tag color={getStatusColor(actualStatus)}>
            {actualStatus.charAt(0).toUpperCase() + actualStatus.slice(1)}
          </Tag>
        );
      }
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_, record: AdminVoucher) => (
        <div>
          <div className="flex items-center space-x-2">
            <Progress
              percent={getUsageRate(record)}
              size="small"
              strokeColor={getUsageRate(record) > 80 ? '#ff4d4f' : '#52c41a'}
              showInfo={false}
            />
            <span className="text-sm">
              {record.usedCount}/{record.maxUses}
            </span>
          </div>
        </div>
      ),
      sorter: (a, b) => getUsageRate(a) - getUsageRate(b)
    },
    {
      title: 'Valid Until',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => (
        <div className="flex items-center space-x-1">
          <CalendarOutlined className="text-gray-500" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      ),
      sorter: (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record: AdminVoucher) => (
        <Space size="small">
          <Tooltip title="Preview">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => handlePreviewVoucher(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEditVoucher(record)}
            />
          </Tooltip>
          <Tooltip title="Distribute">
            <Button 
              type="text" 
              icon={<SendOutlined />}
              onClick={() => handleDistributeVoucher(record)}
              disabled={record.status !== 'active' || isExpired(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this voucher?"
            onConfirm={() => handleDeleteVoucher(record.id)}
          >
            <Tooltip title="Delete">
              <Button 
                type="text" 
                icon={<DeleteOutlined />}
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const renderVoucherModal = () => (
    <Modal
      title={editingVoucher ? 'Edit Voucher' : 'Create New Voucher'}
      open={voucherModalVisible}
      onCancel={() => {
        setVoucherModalVisible(false);
        form.resetFields();
      }}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmitVoucher}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Voucher Name"
              name="name"
              rules={[{ required: true, message: 'Please enter voucher name' }]}
            >
              <Input placeholder="Enter voucher name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Voucher Code"
              name="code"
              rules={[{ required: true, message: 'Please enter voucher code' }]}
            >
              <Input placeholder="Enter voucher code" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea rows={3} placeholder="Enter voucher description" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please select type' }]}
            >
              <Select placeholder="Select type">
                <Option value="discount">Discount</Option>
                <Option value="cashback">Cashback</Option>
                <Option value="freebie">Freebie</Option>
                <Option value="points">Points</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Value Type"
              name="valueType"
              rules={[{ required: true, message: 'Please select value type' }]}
            >
              <Select placeholder="Select value type">
                <Option value="fixed">Fixed Amount</Option>
                <Option value="percentage">Percentage</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Value"
              name="value"
              rules={[{ required: true, message: 'Please enter value' }]}
            >
              <InputNumber 
                min={0} 
                style={{ width: '100%' }} 
                placeholder="Enter value"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Max Uses"
              name="maxUses"
              rules={[{ required: true, message: 'Please enter max uses' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Distribution Type"
              name="distributionType"
              rules={[{ required: true, message: 'Please select distribution type' }]}
            >
              <Select placeholder="Select distribution type">
                <Option value="manual">Manual</Option>
                <Option value="auto">Auto</Option>
                <Option value="game_reward">Game Reward</Option>
                <Option value="streak_reward">Streak Reward</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Valid Period"
          name="dateRange"
          rules={[{ required: true, message: 'Please select valid period' }]}
        >
          <RangePicker showTime style={{ width: '100%' }} />
        </Form.Item>

        <Divider>Conditions</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Min Purchase (optional)"
              name={['conditions', 'minPurchase']}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="Minimum purchase amount" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Min Streak (optional)"
              name={['conditions', 'streakRequired']}
            >
              <InputNumber min={0} style={{ width: '100%' }} placeholder="Minimum streak required" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {editingVoucher ? 'Update Voucher' : 'Create Voucher'}
            </Button>
            <Button onClick={() => {
              setVoucherModalVisible(false);
              form.resetFields();
            }}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderPreviewModal = () => (
    <Modal
      title="Voucher Preview"
      open={previewModalVisible}
      onCancel={() => setPreviewModalVisible(false)}
      footer={null}
      width={600}
    >
      {selectedVoucher && (
        <div>
          <Card className="mb-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🎫</div>
              <h3 className="text-2xl font-bold">{selectedVoucher.name}</h3>
              <p className="text-gray-600">{selectedVoucher.description}</p>
              <div className="mt-4">
                <Tag color={getTypeColor(selectedVoucher.type)} className="text-lg px-4 py-2">
                  {selectedVoucher.valueType === 'percentage' 
                    ? `${selectedVoucher.value}% OFF` 
                    : `${selectedVoucher.value.toLocaleString()}${selectedVoucher.type === 'points' ? ' POINTS' : 'đ OFF'}`
                  }
                </Tag>
              </div>
            </div>
          </Card>

          <Row gutter={16} className="mb-4">
            <Col span={8}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Status"
                  value={selectedVoucher.status}
                  prefix={<CheckCircleOutlined className="text-green-500" />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Used"
                  value={selectedVoucher.usedCount}
                  suffix={`/${selectedVoucher.maxUses}`}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Usage Rate"
                  value={getUsageRate(selectedVoucher)}
                  precision={1}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>

          <Card title="Voucher Details" size="small">
            <div className="space-y-2">
              <div><strong>Code:</strong> {selectedVoucher.code}</div>
              <div><strong>Type:</strong> {selectedVoucher.type}</div>
              <div><strong>Value Type:</strong> {selectedVoucher.valueType}</div>
              <div><strong>Distribution:</strong> {selectedVoucher.distributionType}</div>
              <div><strong>Valid From:</strong> {new Date(selectedVoucher.startDate).toLocaleString()}</div>
              <div><strong>Valid Until:</strong> {new Date(selectedVoucher.endDate).toLocaleString()}</div>
            </div>
          </Card>

          {selectedVoucher.conditions && Object.keys(selectedVoucher.conditions).length > 0 && (
            <Card title="Conditions" size="small" className="mt-4">
              <div className="space-y-2">
                {selectedVoucher.conditions.minPurchase && (
                  <div><strong>Min Purchase:</strong> {selectedVoucher.conditions.minPurchase.toLocaleString()}đ</div>
                )}
                {selectedVoucher.conditions.streakRequired && (
                  <div><strong>Min Streak:</strong> {selectedVoucher.conditions.streakRequired} days</div>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </Modal>
  );

  const renderDistributeModal = () => (
    <Modal
      title="Distribute Voucher"
      open={distributeModalVisible}
      onCancel={() => setDistributeModalVisible(false)}
      onOk={handleSubmitDistribution}
      width={800}
    >
      <div className="mb-4">
        <p>Select users to distribute voucher: <strong>{selectedVoucher?.name}</strong></p>
      </div>
      <Transfer
        dataSource={users.map(user => ({
          key: user.id,
          title: user.username,
          description: user.email,
          disabled: user.status === 'banned'
        }))}
        targetKeys={targetKeys}
        onChange={setTargetKeys}
        render={(item) => (
          <div className="flex items-center space-x-2">
            <Avatar size="small" src={users.find(u => u.id === item.key)?.avatar} />
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </div>
        )}
        showSearch
        listStyle={{ width: 300, height: 400 }}
      />
    </Modal>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Voucher Management</h2>
              <p className="text-gray-600">Create, manage, and distribute vouchers to users</p>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateVoucher}
              >
                Create Voucher
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchVouchers(filters)}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </div>

          {/* Voucher Stats */}
          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Total Vouchers"
                  value={vouchers.length}
                  prefix={<GiftOutlined className="text-blue-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Active Vouchers"
                  value={vouchers.filter(v => v.status === 'active' && !isExpired(v)).length}
                  prefix={<CheckCircleOutlined className="text-green-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Expired Vouchers"
                  value={vouchers.filter(v => isExpired(v)).length}
                  prefix={<ExclamationCircleOutlined className="text-red-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Total Usage"
                  value={vouchers.reduce((sum, v) => sum + v.usedCount, 0)}
                  prefix={<SendOutlined className="text-purple-500" />}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={vouchers}
          rowKey="id"
          loading={loading}
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: vouchers.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} vouchers`
          }}
          onChange={(pagination) => {
            setFilter({
              page: pagination.current,
              pageSize: pagination.pageSize
            });
          }}
        />
      </Card>

      {renderVoucherModal()}
      {renderPreviewModal()}
      {renderDistributeModal()}
    </motion.div>
  );
};

export default VoucherManagement; 