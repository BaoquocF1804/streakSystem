import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Avatar, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker,
  Row,
  Col,
  Statistic,
  Progress,
  Tooltip,
  Badge,
  message,
  Tabs,
  InputNumber
} from 'antd';
import { 
  UserAddOutlined, 
  SearchOutlined, 
  FilterOutlined,
  ReloadOutlined,
  ExportOutlined,
  TrophyOutlined,
  PercentageOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  EyeOutlined,
  MailOutlined,
  ShareAltOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useSocialStore } from '../../../stores/socialStore';
import { FriendInvite, InviteStats } from '../../../types/social';
import type { ColumnsType } from 'antd/es/table';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const FriendInviteTracking: React.FC = () => {
  const [inviteLimitModalVisible, setInviteLimitModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const {
    invites,
    inviteStats,
    inviteFilter,
    loading,
    fetchInvites,
    fetchInviteStats,
    updateInviteLimit,
    blockUser,
    setInviteFilter
  } = useSocialStore();

  useEffect(() => {
    fetchInvites();
    fetchInviteStats();
  }, []);

  const handleSearch = (value: string) => {
    setInviteFilter({ ...inviteFilter, search: value });
    fetchInvites({ ...inviteFilter, search: value });
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilter = { ...inviteFilter, [key]: value };
    setInviteFilter(newFilter);
    fetchInvites(newFilter);
  };

  const handleUpdateInviteLimit = async (values: any) => {
    if (selectedUserId) {
      await updateInviteLimit(selectedUserId, values.limit);
      message.success('Invite limit updated successfully');
      setInviteLimitModalVisible(false);
      form.resetFields();
      fetchInviteStats();
    }
  };

  const handleBlockUser = async (userId: string) => {
    await blockUser(userId);
    message.success('User blocked successfully');
    fetchInviteStats();
  };

  const getInviteStatusColor = (status: FriendInvite['status']) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'accepted': return 'green';
      case 'declined': return 'red';
      case 'expired': return 'default';
      default: return 'default';
    }
  };

  const getInviteStatusLabel = (status: FriendInvite['status']) => {
    switch (status) {
      case 'pending': return 'Đang chờ';
      case 'accepted': return 'Đã chấp nhận';
      case 'declined': return 'Đã từ chối';
      case 'expired': return 'Hết hạn';
      default: return status;
    }
  };

  const getInviteStatusIcon = (status: FriendInvite['status']) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'accepted': return <CheckCircleOutlined />;
      case 'declined': return <CloseCircleOutlined />;
      case 'expired': return <StopOutlined />;
      default: return null;
    }
  };

  const getInviteSourceLabel = (source: FriendInvite['inviteSource']) => {
    switch (source) {
      case 'direct': return 'Trực tiếp';
      case 'group': return 'Từ nhóm';
      case 'product_share': return 'Chia sẻ SP';
      case 'referral': return 'Giới thiệu';
      default: return source;
    }
  };

  const getInviteSourceColor = (source: FriendInvite['inviteSource']) => {
    switch (source) {
      case 'direct': return 'blue';
      case 'group': return 'green';
      case 'product_share': return 'purple';
      case 'referral': return 'orange';
      default: return 'default';
    }
  };

  const inviteColumns: ColumnsType<FriendInvite> = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
      width: 60
    },
    {
      title: 'User mời',
      dataIndex: 'inviterName',
      key: 'inviterName',
      render: (name: string) => (
        <div className="flex items-center space-x-2">
          <Avatar size={32} className="bg-blue-500">
            {name.charAt(0)}
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      )
    },
    {
      title: 'User được mời',
      render: (_, record: FriendInvite) => (
        <div>
          <div className="font-medium">{record.inviteeName || 'N/A'}</div>
          <div className="text-xs text-gray-500">{record.inviteeEmail}</div>
        </div>
      )
    },
    {
      title: 'Thời gian gửi',
      dataIndex: 'sentAt',
      key: 'sentAt',
      render: (date: string) => (
        <div>
          <div>{new Date(date).toLocaleDateString('vi-VN')}</div>
          <div className="text-xs text-gray-500">
            {new Date(date).toLocaleTimeString('vi-VN')}
          </div>
        </div>
      )
    },
    {
      title: 'Nguồn',
      dataIndex: 'inviteSource',
      key: 'inviteSource',
      render: (source: FriendInvite['inviteSource']) => (
        <Tag color={getInviteSourceColor(source)}>
          {getInviteSourceLabel(source)}
        </Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: FriendInvite['status']) => (
        <Tag 
          color={getInviteStatusColor(status)}
          icon={getInviteStatusIcon(status)}
        >
          {getInviteStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: 'Đã tham gia',
      dataIndex: 'hasJoined',
      key: 'hasJoined',
      render: (hasJoined: boolean) => (
        <Badge 
          status={hasJoined ? 'success' : 'default'}
          text={hasJoined ? 'Đã tham gia' : 'Chưa tham gia'}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record: FriendInvite) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => {
                // Handle view detail
              }}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Gửi lại">
              <Button 
                type="text" 
                icon={<MailOutlined />}
                onClick={() => {
                  // Handle resend invite
                }}
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  const statsColumns: ColumnsType<InviteStats> = [
    {
      title: 'User',
      dataIndex: 'username',
      key: 'username',
      render: (username: string) => (
        <div className="flex items-center space-x-2">
          <Avatar size={32} className="bg-blue-500">
            {username.charAt(0)}
          </Avatar>
          <span className="font-medium">{username}</span>
        </div>
      )
    },
    {
      title: 'Số invite gửi',
      dataIndex: 'totalInvitesSent',
      key: 'totalInvitesSent',
      render: (count: number) => (
        <div className="text-center">
          <div className="font-medium text-lg">{count}</div>
          <div className="text-xs text-gray-500">tổng cộng</div>
        </div>
      ),
      sorter: (a, b) => a.totalInvitesSent - b.totalInvitesSent
    },
    {
      title: 'Số bạn mới',
      dataIndex: 'newFriendsCount',
      key: 'newFriendsCount',
      render: (count: number) => (
        <div className="text-center">
          <div className="font-medium text-lg text-green-600">{count}</div>
          <div className="text-xs text-gray-500">bạn mới</div>
        </div>
      ),
      sorter: (a, b) => a.newFriendsCount - b.newFriendsCount
    },
    {
      title: 'Tỷ lệ thành công',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate: number) => (
        <div className="text-center">
          <Progress 
            type="circle" 
            percent={rate} 
            size={50}
            strokeColor={rate >= 70 ? '#52c41a' : rate >= 50 ? '#faad14' : '#ff4d4f'}
          />
          <div className="text-xs text-gray-500 mt-1">{rate.toFixed(1)}%</div>
        </div>
      ),
      sorter: (a, b) => a.successRate - b.successRate
    },
    {
      title: 'Hoạt động',
      render: (_, record: InviteStats) => (
        <div className="text-center">
          <div className="text-sm">
            <div>Hôm nay: <span className="font-medium">{record.todayInvites}</span></div>
            <div>Tuần: <span className="font-medium">{record.weeklyInvites}</span></div>
            <div>Tháng: <span className="font-medium">{record.monthlyInvites}</span></div>
          </div>
        </div>
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record: InviteStats) => (
        <Space size="small">
          <Tooltip title="Cài đặt giới hạn">
            <Button 
              type="text" 
              icon={<SettingOutlined />}
              onClick={() => {
                setSelectedUserId(record.userId);
                setInviteLimitModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Chặn user">
            <Button 
              type="text" 
              icon={<StopOutlined />}
              danger
              onClick={() => handleBlockUser(record.userId)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Chart data
  const dailyInviteData = {
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    datasets: [
      {
        label: 'Lời mời gửi',
        data: [12, 19, 3, 5, 2, 3, 9],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Lời mời chấp nhận',
        data: [8, 12, 2, 3, 1, 2, 6],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const inviteStatusData = {
    labels: ['Đã chấp nhận', 'Đang chờ', 'Đã từ chối', 'Hết hạn'],
    datasets: [
      {
        data: [
          invites.filter(i => i.status === 'accepted').length,
          invites.filter(i => i.status === 'pending').length,
          invites.filter(i => i.status === 'declined').length,
          invites.filter(i => i.status === 'expired').length
        ],
        backgroundColor: [
          '#52c41a',
          '#faad14',
          '#ff4d4f',
          '#d9d9d9'
        ],
        borderWidth: 1
      }
    ]
  };

  const inviteSourceData = {
    labels: ['Trực tiếp', 'Từ nhóm', 'Chia sẻ SP', 'Giới thiệu'],
    datasets: [
      {
        data: [
          invites.filter(i => i.inviteSource === 'direct').length,
          invites.filter(i => i.inviteSource === 'group').length,
          invites.filter(i => i.inviteSource === 'product_share').length,
          invites.filter(i => i.inviteSource === 'referral').length
        ],
        backgroundColor: [
          '#1890ff',
          '#52c41a',
          '#722ed1',
          '#faad14'
        ],
        borderWidth: 1
      }
    ]
  };

  const acceptanceRateData = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Tỷ lệ chấp nhận (%)',
        data: [65, 72, 68, 75],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      }
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Friend & Invite Tracking</h2>
              <p className="text-gray-600">Theo dõi lời mời bạn bè và phân tích hiệu quả</p>
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  fetchInvites(inviteFilter);
                  fetchInviteStats();
                }}
                loading={loading}
              >
                Làm mới
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={() => {
                  // Handle export
                }}
              >
                Xuất dữ liệu
              </Button>
            </Space>
          </div>

          {/* Overview Stats */}
          <Row gutter={16}>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Tổng lời mời"
                  value={invites.length}
                  prefix={<MailOutlined className="text-blue-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Đã chấp nhận"
                  value={invites.filter(i => i.status === 'accepted').length}
                  prefix={<CheckCircleOutlined className="text-green-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Tỷ lệ chấp nhận"
                  value={invites.length > 0 ? (invites.filter(i => i.status === 'accepted').length / invites.length * 100).toFixed(1) : 0}
                  suffix="%"
                  prefix={<PercentageOutlined className="text-purple-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Bạn mới hôm nay"
                  value={inviteStats.reduce((sum, stat) => sum + stat.todayInvites, 0)}
                  prefix={<UserAddOutlined className="text-orange-500" />}
                />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Charts */}
        <Card title="Biểu đồ phân tích">
          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" title="Lời mời bạn bè theo ngày">
                <Bar data={dailyInviteData} options={chartOptions} />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="Tỷ lệ chấp nhận theo tuần">
                <Line data={acceptanceRateData} options={chartOptions} />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} className="mt-4">
            <Col span={12}>
              <Card size="small" title="Trạng thái lời mời">
                <Pie data={inviteStatusData} options={chartOptions} />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="Nguồn lời mời">
                <Pie data={inviteSourceData} options={chartOptions} />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Tables */}
        <Card>
          <Tabs defaultActiveKey="invites">
            <TabPane tab="Danh sách lời mời" key="invites">
              <div className="mb-4">
                <div className="flex flex-wrap gap-4">
                  <Search
                    placeholder="Tìm kiếm theo tên, email..."
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                  />
                  
                  <Select
                    placeholder="Trạng thái"
                    allowClear
                    style={{ width: 150 }}
                    onChange={(value) => handleFilterChange('status', value)}
                  >
                    <Option value="pending">Đang chờ</Option>
                    <Option value="accepted">Đã chấp nhận</Option>
                    <Option value="declined">Đã từ chối</Option>
                    <Option value="expired">Hết hạn</Option>
                  </Select>

                  <RangePicker
                    placeholder={['Từ ngày', 'Đến ngày']}
                    onChange={(dates) => handleFilterChange('dateRange', dates)}
                  />
                </div>
              </div>

              <Table
                columns={inviteColumns}
                dataSource={invites}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lời mời`
                }}
              />
            </TabPane>

            <TabPane tab="Thống kê người dùng" key="stats">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3>Top người mời bạn bè</h3>
                  <Space>
                    <Button icon={<TrophyOutlined />} type="primary">
                      Leaderboard
                    </Button>
                  </Space>
                </div>
              </div>

              <Table
                columns={statsColumns}
                dataSource={inviteStats}
                rowKey="userId"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`
                }}
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* Invite Limit Modal */}
      <Modal
        title="Cài đặt giới hạn lời mời"
        open={inviteLimitModalVisible}
        onCancel={() => {
          setInviteLimitModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateInviteLimit}
        >
          <Form.Item
            label="Giới hạn lời mời/ngày"
            name="limit"
            rules={[
              { required: true, message: 'Vui lòng nhập giới hạn' },
              { type: 'number', min: 1, max: 100, message: 'Giới hạn từ 1-100' }
            ]}
          >
            <InputNumber
              min={1}
              max={100}
              style={{ width: '100%' }}
              placeholder="Nhập số lượng tối đa"
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật
              </Button>
              <Button onClick={() => {
                setInviteLimitModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </motion.div>
  );
};

export default FriendInviteTracking; 