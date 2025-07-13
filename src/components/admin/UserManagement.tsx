import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Input, 
  Button, 
  Space, 
  Tag, 
  Avatar, 
  Select, 
  DatePicker, 
  Drawer, 
  Descriptions, 
  Tabs, 
  Badge,
  Modal,
  Form,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Timeline,
  List
} from 'antd';
import { 
  UserOutlined, 
  EyeOutlined, 
  EditOutlined, 
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  StopOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  TrophyOutlined,
  FireOutlined,
  HistoryOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../stores/adminStore';
import { AdminUser, AdminUserDetail } from '../../types/admin';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const UserManagement: React.FC = () => {
  const [userDetailVisible, setUserDetailVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [pointsModalVisible, setPointsModalVisible] = useState(false);
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [form] = Form.useForm();

  const {
    users,
    selectedUser,
    loading,
    filters,
    fetchUsers,
    getUserDetail,
    updateUserStatus,
    resetUserStreak,
    addUserPoints,
    sendVoucherToUser,
    setFilter,
    clearFilter,
    vouchers
  } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (value: string) => {
    setFilter({ search: value, page: 1 });
    fetchUsers({ ...filters, search: value, page: 1 });
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilter(newFilters);
    fetchUsers(newFilters);
  };

  const handleViewUser = async (userId: string) => {
    setSelectedUserId(userId);
    setUserDetailVisible(true);
    await getUserDetail(userId);
  };

  const handleUpdateStatus = async (userId: string, status: AdminUser['status']) => {
    await updateUserStatus(userId, status);
    fetchUsers(filters);
  };

  const handleResetStreak = async (userId: string) => {
    await resetUserStreak(userId);
    fetchUsers(filters);
  };

  const handleAddPoints = async (values: any) => {
    if (selectedUserId) {
      await addUserPoints(selectedUserId, values.points, values.reason);
      setPointsModalVisible(false);
      form.resetFields();
      fetchUsers(filters);
      if (userDetailVisible) {
        getUserDetail(selectedUserId);
      }
    }
  };

  const handleSendVoucher = async (values: any) => {
    if (selectedUserId) {
      await sendVoucherToUser(selectedUserId, values.voucherId);
      setVoucherModalVisible(false);
      form.resetFields();
      fetchUsers(filters);
      if (userDetailVisible) {
        getUserDetail(selectedUserId);
      }
    }
  };

  const getStatusColor = (status: AdminUser['status']) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'orange';
      case 'banned': return 'red';
      default: return 'default';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'purple';
      case 'Advanced': return 'blue';
      case 'Intermediate': return 'green';
      case 'Beginner': return 'orange';
      default: return 'default';
    }
  };

  const columns: ColumnsType<AdminUser> = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 60,
      render: (avatar: string, record: AdminUser) => (
        <Avatar 
          size={40} 
          src={avatar} 
          icon={<UserOutlined />}
          className="bg-blue-500"
        />
      )
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      render: (username: string, record: AdminUser) => (
        <div>
          <div className="font-medium">{username}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      )
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>{level}</Tag>
      )
    },
    {
      title: 'Streak',
      dataIndex: 'currentStreak',
      key: 'currentStreak',
      render: (streak: number) => (
        <div className="flex items-center space-x-1">
          <FireOutlined className="text-orange-500" />
          <span className="font-medium">{streak}</span>
        </div>
      ),
      sorter: (a, b) => a.currentStreak - b.currentStreak
    },
    {
      title: 'Points',
      dataIndex: 'totalPoints',
      key: 'totalPoints',
      render: (points: number) => (
        <div className="flex items-center space-x-1">
          <TrophyOutlined className="text-yellow-500" />
          <span className="font-medium">{points.toLocaleString()}</span>
        </div>
      ),
      sorter: (a, b) => a.totalPoints - b.totalPoints
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AdminUser['status']) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record: AdminUser) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleViewUser(record.id)}
            title="View Details"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedUserId(record.id);
              setPointsModalVisible(true);
            }}
            title="Add Points"
          />
          <Popconfirm
            title={`Are you sure to ${record.status === 'banned' ? 'unban' : 'ban'} this user?`}
            onConfirm={() => handleUpdateStatus(record.id, record.status === 'banned' ? 'active' : 'banned')}
          >
            <Button 
              type="text" 
              icon={record.status === 'banned' ? <CheckCircleOutlined /> : <StopOutlined />}
              danger={record.status !== 'banned'}
              title={record.status === 'banned' ? 'Unban User' : 'Ban User'}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const renderUserDetail = () => {
    if (!selectedUser) return null;

    return (
      <Drawer
        title={
          <div className="flex items-center space-x-3">
            <Avatar 
              size={40} 
              src={selectedUser.avatar} 
              icon={<UserOutlined />}
              className="bg-blue-500"
            />
            <div>
              <div className="font-medium">{selectedUser.username}</div>
              <div className="text-sm text-gray-500">{selectedUser.email}</div>
            </div>
          </div>
        }
        width={720}
        open={userDetailVisible}
        onClose={() => setUserDetailVisible(false)}
        extra={
          <Space>
            <Button
              icon={<GiftOutlined />}
              onClick={() => setVoucherModalVisible(true)}
            >
              Send Voucher
            </Button>
            <Button
              icon={<DollarOutlined />}
              onClick={() => setPointsModalVisible(true)}
            >
              Add Points
            </Button>
            <Popconfirm
              title="Are you sure to reset this user's streak?"
              onConfirm={() => handleResetStreak(selectedUser.id)}
            >
              <Button icon={<FireOutlined />} danger>
                Reset Streak
              </Button>
            </Popconfirm>
          </Space>
        }
      >
        <Tabs defaultActiveKey="overview">
          <TabPane tab="Overview" key="overview">
            <Row gutter={16} className="mb-6">
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Points"
                    value={selectedUser.totalPoints}
                    prefix={<TrophyOutlined className="text-yellow-500" />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Current Streak"
                    value={selectedUser.currentStreak}
                    prefix={<FireOutlined className="text-orange-500" />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Games Played"
                    value={selectedUser.gamesPlayed}
                    prefix={<UserOutlined className="text-blue-500" />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Vouchers Used"
                    value={selectedUser.vouchersUsed}
                    prefix={<GiftOutlined className="text-green-500" />}
                  />
                </Card>
              </Col>
            </Row>

            <Descriptions title="User Information" bordered>
              <Descriptions.Item label="User ID">{selectedUser.id}</Descriptions.Item>
              <Descriptions.Item label="Level">
                <Tag color={getLevelColor(selectedUser.level)}>{selectedUser.level}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Experience">{selectedUser.experience}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedUser.status)}>
                  {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Login Count">{selectedUser.loginCount}</Descriptions.Item>
              <Descriptions.Item label="Max Streak">{selectedUser.maxStreak}</Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(selectedUser.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Active">
                {new Date(selectedUser.lastActive).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Role" span={2}>
                <Tag color="blue">{selectedUser.role}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </TabPane>

          <TabPane tab="Game History" key="games">
            <List
              dataSource={selectedUser.gameHistory || []}
              renderItem={(session) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={`Game: ${session.gameId}`}
                    description={`Score: ${session.score} | Duration: ${session.duration}s | ${new Date(session.playedAt).toLocaleString()}`}
                  />
                  <div>
                    <Tag color={session.result === 'win' ? 'green' : session.result === 'lose' ? 'red' : 'blue'}>
                      {session.result || 'completed'}
                    </Tag>
                  </div>
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane tab="Achievements" key="achievements">
            <List
              dataSource={selectedUser.achievements || []}
              renderItem={(achievement) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<TrophyOutlined />} />}
                    title={achievement}
                    description="Achievement unlocked"
                  />
                </List.Item>
              )}
            />
          </TabPane>

          <TabPane tab="Activity Log" key="activity">
            <Timeline>
              <Timeline.Item color="green">
                <strong>User registered</strong>
                <br />
                {new Date(selectedUser.createdAt).toLocaleString()}
              </Timeline.Item>
              <Timeline.Item color="blue">
                <strong>Last active</strong>
                <br />
                {new Date(selectedUser.lastActive).toLocaleString()}
              </Timeline.Item>
            </Timeline>
          </TabPane>
        </Tabs>
      </Drawer>
    );
  };

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
              <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
              <p className="text-gray-600">Manage users, track activities, and handle user actions</p>
            </div>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => fetchUsers(filters)}
              loading={loading}
            >
              Refresh
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <Search
              placeholder="Search by username or email"
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
            
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="banned">Banned</Option>
            </Select>

            <Select
              placeholder="Filter by level"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => handleFilterChange('level', value)}
            >
              <Option value="Novice">Novice</Option>
              <Option value="Beginner">Beginner</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Advanced">Advanced</Option>
              <Option value="Expert">Expert</Option>
            </Select>

            <Button
              icon={<FilterOutlined />}
              onClick={clearFilter}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: users.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`
          }}
          onChange={(pagination, filters, sorter) => {
            setFilter({
              page: pagination.current,
              pageSize: pagination.pageSize
            });
          }}
        />
      </Card>

      {renderUserDetail()}

      {/* Add Points Modal */}
      <Modal
        title="Add Points to User"
        open={pointsModalVisible}
        onCancel={() => {
          setPointsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddPoints}
        >
          <Form.Item
            label="Points"
            name="points"
            rules={[{ required: true, message: 'Please enter points amount' }]}
          >
            <InputNumber
              min={1}
              max={10000}
              style={{ width: '100%' }}
              placeholder="Enter points to add"
            />
          </Form.Item>
          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: 'Please enter reason' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter reason for adding points"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Points
              </Button>
              <Button onClick={() => {
                setPointsModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Send Voucher Modal */}
      <Modal
        title="Send Voucher to User"
        open={voucherModalVisible}
        onCancel={() => {
          setVoucherModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendVoucher}
        >
          <Form.Item
            label="Voucher"
            name="voucherId"
            rules={[{ required: true, message: 'Please select a voucher' }]}
          >
            <Select placeholder="Select voucher to send">
              {vouchers.map(voucher => (
                <Option key={voucher.id} value={voucher.id}>
                  {voucher.name} - {voucher.code}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Send Voucher
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
    </motion.div>
  );
};

export default UserManagement; 