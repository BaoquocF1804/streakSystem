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
  Popconfirm,
  Drawer,
  Tabs,
  InputNumber,
  List,
  Typography,
  Descriptions
} from 'antd';
import { 
  TrophyOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SearchOutlined, 
  FilterOutlined,
  ReloadOutlined,
  ExportOutlined,
  GiftOutlined,
  UserOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  StarOutlined,
  CrownOutlined,
  FireOutlined,
  ThunderboltOutlined,
  ShareAltOutlined,
  TeamOutlined
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
import { ViralCampaign, ViralLeaderboard } from '../../../types/social';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';

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
const { TextArea } = Input;
const { Title: AntTitle } = Typography;

const ViralCampaignComponent: React.FC = () => {
  const [campaignModalVisible, setCampaignModalVisible] = useState(false);
  const [campaignDetailVisible, setCampaignDetailVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<ViralCampaign | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const {
    viralCampaigns,
    leaderboards,
    loading,
    fetchViralCampaigns,
    fetchLeaderboards,
    createViralCampaign,
    updateViralCampaign,
    deleteViralCampaign
  } = useSocialStore();

  useEffect(() => {
    fetchViralCampaigns();
    fetchLeaderboards('overall', 'monthly');
  }, []);

  const handleCreateCampaign = () => {
    setSelectedCampaign(null);
    setIsEditing(false);
    setCampaignModalVisible(true);
  };

  const handleEditCampaign = (campaign: ViralCampaign) => {
    setSelectedCampaign(campaign);
    setIsEditing(true);
    form.setFieldsValue({
      ...campaign,
      startDate: moment(campaign.startDate),
      endDate: moment(campaign.endDate)
    });
    setCampaignModalVisible(true);
  };

  const handleViewCampaign = (campaign: ViralCampaign) => {
    setSelectedCampaign(campaign);
    setCampaignDetailVisible(true);
  };

  const handleSubmitCampaign = async (values: any) => {
    const campaignData = {
      ...values,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      rewards: values.rewards || [],
      rules: values.rules || []
    };

    if (isEditing && selectedCampaign) {
      await updateViralCampaign(selectedCampaign.id, campaignData);
      message.success('Campaign updated successfully');
    } else {
      await createViralCampaign(campaignData);
      message.success('Campaign created successfully');
    }

    setCampaignModalVisible(false);
    form.resetFields();
    fetchViralCampaigns();
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    await deleteViralCampaign(campaignId);
    message.success('Campaign deleted successfully');
    fetchViralCampaigns();
  };

  const handleToggleCampaign = async (campaign: ViralCampaign) => {
    const newStatus = campaign.status === 'active' ? 'inactive' : 'active';
    await updateViralCampaign(campaign.id, { status: newStatus });
    message.success(`Campaign ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    fetchViralCampaigns();
  };

  const getCampaignStatusColor = (status: ViralCampaign['status']) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'orange';
      case 'completed': return 'blue';
      default: return 'default';
    }
  };

  const getCampaignStatusLabel = (status: ViralCampaign['status']) => {
    switch (status) {
      case 'active': return 'Đang hoạt động';
      case 'inactive': return 'Tạm ngưng';
      case 'completed': return 'Hoàn thành';
      default: return status;
    }
  };

  const getCampaignTypeColor = (type: ViralCampaign['type']) => {
    switch (type) {
      case 'referral': return 'blue';
      case 'sharing': return 'green';
      case 'group_challenge': return 'purple';
      case 'invite_contest': return 'orange';
      default: return 'default';
    }
  };

  const getCampaignTypeLabel = (type: ViralCampaign['type']) => {
    switch (type) {
      case 'referral': return 'Giới thiệu';
      case 'sharing': return 'Chia sẻ';
      case 'group_challenge': return 'Thử thách nhóm';
      case 'invite_contest': return 'Cuộc thi mời bạn';
      default: return type;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <CrownOutlined className="text-yellow-500" />;
      case 2: return <TrophyOutlined className="text-gray-400" />;
      case 3: return <TrophyOutlined className="text-amber-600" />;
      default: return <TrophyOutlined className="text-gray-300" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return 'default';
    }
  };

  const campaignColumns: ColumnsType<ViralCampaign> = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
      width: 60
    },
    {
      title: 'Tên chiến dịch',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: ViralCampaign) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">{record.description}</div>
        </div>
      )
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: ViralCampaign['type']) => (
        <Tag color={getCampaignTypeColor(type)}>
          {getCampaignTypeLabel(type)}
        </Tag>
      )
    },
    {
      title: 'Thời gian',
      render: (_, record: ViralCampaign) => (
        <div className="text-sm">
          <div>Bắt đầu: {new Date(record.startDate).toLocaleDateString('vi-VN')}</div>
          <div>Kết thúc: {new Date(record.endDate).toLocaleDateString('vi-VN')}</div>
        </div>
      )
    },
    {
      title: 'Tiến độ',
      render: (_, record: ViralCampaign) => (
        <div className="text-center">
          <Progress
            type="circle"
            percent={Math.round((record.currentValue / record.targetValue) * 100)}
            size={50}
            strokeColor="#52c41a"
            format={() => `${record.currentValue}/${record.targetValue}`}
          />
          <div className="text-xs text-gray-500 mt-1">
            {record.targetMetric}
          </div>
        </div>
      )
    },
    {
      title: 'Người tham gia',
      dataIndex: 'participantCount',
      key: 'participantCount',
      render: (count: number) => (
        <div className="text-center">
          <div className="font-medium text-lg">{count}</div>
          <UserOutlined className="text-blue-500" />
        </div>
      ),
      sorter: (a, b) => a.participantCount - b.participantCount
    },
    {
      title: 'Phần thưởng',
      dataIndex: 'rewards',
      key: 'rewards',
      render: (rewards: ViralCampaign['rewards']) => (
        <div className="text-center">
          <Badge count={rewards.length} color="purple">
            <GiftOutlined className="text-purple-500" />
          </Badge>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ViralCampaign['status']) => (
        <Tag color={getCampaignStatusColor(status)}>
          {getCampaignStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record: ViralCampaign) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => handleViewCampaign(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEditCampaign(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'}>
            <Button 
              type="text" 
              icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => handleToggleCampaign(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc muốn xóa chiến dịch này?"
            onConfirm={() => handleDeleteCampaign(record.id)}
          >
            <Tooltip title="Xóa">
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

  const leaderboardColumns: ColumnsType<ViralLeaderboard> = [
    {
      title: 'Hạng',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank: number) => (
        <div className="text-center">
          <Badge count={rank} color={getRankColor(rank)}>
            {getRankIcon(rank)}
          </Badge>
        </div>
      ),
      width: 80
    },
    {
      title: 'User',
      render: (_, record: ViralLeaderboard) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            src={record.avatar} 
            className="bg-blue-500"
          >
            {record.username.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{record.username}</div>
            {record.badge && (
              <Tag color="gold" size="small">
                {record.badge}
              </Tag>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      render: (score: number, record: ViralLeaderboard) => (
        <div className="text-center">
          <div className="font-medium text-lg">{score}</div>
          <div className="text-xs text-gray-500">{record.metric}</div>
        </div>
      ),
      sorter: (a, b) => a.score - b.score
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: ViralLeaderboard['category']) => {
        const categoryConfig = {
          invites: { label: 'Lời mời', color: 'blue', icon: <UserOutlined /> },
          shares: { label: 'Chia sẻ', color: 'green', icon: <ShareAltOutlined /> },
          group_activity: { label: 'Hoạt động nhóm', color: 'purple', icon: <TeamOutlined /> },
          reviews: { label: 'Đánh giá', color: 'orange', icon: <StarOutlined /> },
          overall: { label: 'Tổng thể', color: 'gold', icon: <CrownOutlined /> }
        };
        const config = categoryConfig[category] || categoryConfig.overall;
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      }
    },
    {
      title: 'Thời gian',
      dataIndex: 'period',
      key: 'period',
      render: (period: ViralLeaderboard['period']) => {
        const periodConfig = {
          daily: { label: 'Hôm nay', color: 'green' },
          weekly: { label: 'Tuần này', color: 'blue' },
          monthly: { label: 'Tháng này', color: 'purple' },
          all_time: { label: 'Mọi thời gian', color: 'gold' }
        };
        const config = periodConfig[period] || periodConfig.all_time;
        return (
          <Tag color={config.color}>
            {config.label}
          </Tag>
        );
      }
    },
    {
      title: 'Phần thưởng',
      dataIndex: 'rewards',
      key: 'rewards',
      render: (rewards: number) => (
        <div className="text-center">
          <div className="font-medium text-green-600">
            {rewards.toLocaleString('vi-VN')}đ
          </div>
          <GiftOutlined className="text-green-500" />
        </div>
      )
    }
  ];

  // Chart data
  const campaignPerformanceData = {
    labels: viralCampaigns.map(c => c.name),
    datasets: [
      {
        label: 'Tiến độ (%)',
        data: viralCampaigns.map(c => Math.round((c.currentValue / c.targetValue) * 100)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const participantData = {
    labels: viralCampaigns.map(c => c.name),
    datasets: [
      {
        label: 'Số người tham gia',
        data: viralCampaigns.map(c => c.participantCount),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const leaderboardTrendData = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Top 1',
        data: [100, 120, 150, 180],
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.2)',
        tension: 0.1
      },
      {
        label: 'Top 2',
        data: [80, 95, 110, 125],
        borderColor: 'rgb(192, 192, 192)',
        backgroundColor: 'rgba(192, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'Top 3',
        data: [60, 70, 85, 95],
        borderColor: 'rgb(205, 127, 50)',
        backgroundColor: 'rgba(205, 127, 50, 0.2)',
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

  const activeCampaigns = viralCampaigns.filter(c => c.status === 'active').length;
  const totalParticipants = viralCampaigns.reduce((sum, c) => sum + c.participantCount, 0);
  const avgProgress = viralCampaigns.length > 0 
    ? viralCampaigns.reduce((sum, c) => sum + (c.currentValue / c.targetValue), 0) / viralCampaigns.length * 100
    : 0;

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
              <h2 className="text-2xl font-bold text-gray-800">Viral Campaign & Leaderboard</h2>
              <p className="text-gray-600">Quản lý chiến dịch viral và bảng xếp hạng</p>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateCampaign}
              >
                Tạo chiến dịch
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  fetchViralCampaigns();
                  fetchLeaderboards('overall', 'monthly');
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
                  title="Tổng chiến dịch"
                  value={viralCampaigns.length}
                  prefix={<FireOutlined className="text-orange-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Đang hoạt động"
                  value={activeCampaigns}
                  prefix={<ThunderboltOutlined className="text-green-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Tổng người tham gia"
                  value={totalParticipants}
                  prefix={<UserOutlined className="text-blue-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Tiến độ trung bình"
                  value={avgProgress.toFixed(1)}
                  suffix="%"
                  prefix={<RiseOutlined className="text-purple-500" />}
                />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Charts */}
        <Card title="Biểu đồ phân tích">
          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" title="Hiệu suất chiến dịch">
                <Bar data={campaignPerformanceData} options={chartOptions} />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="Số người tham gia">
                <Bar data={participantData} options={chartOptions} />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} className="mt-4">
            <Col span={24}>
              <Card size="small" title="Xu hướng Top 3">
                <Line data={leaderboardTrendData} options={chartOptions} />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Tables */}
        <Card>
          <Tabs defaultActiveKey="campaigns">
            <TabPane tab="Chiến dịch Viral" key="campaigns">
              <Table
                columns={campaignColumns}
                dataSource={viralCampaigns}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chiến dịch`
                }}
              />
            </TabPane>

            <TabPane tab="Bảng xếp hạng" key="leaderboard">
              <div className="mb-4">
                <div className="flex flex-wrap gap-4">
                  <Select
                    defaultValue="overall"
                    style={{ width: 150 }}
                    onChange={(value) => fetchLeaderboards(value, 'monthly')}
                  >
                    <Option value="overall">Tổng thể</Option>
                    <Option value="invites">Lời mời</Option>
                    <Option value="shares">Chia sẻ</Option>
                    <Option value="group_activity">Hoạt động nhóm</Option>
                    <Option value="reviews">Đánh giá</Option>
                  </Select>
                  
                  <Select
                    defaultValue="monthly"
                    style={{ width: 150 }}
                    onChange={(value) => fetchLeaderboards('overall', value)}
                  >
                    <Option value="daily">Hôm nay</Option>
                    <Option value="weekly">Tuần này</Option>
                    <Option value="monthly">Tháng này</Option>
                    <Option value="all_time">Mọi thời gian</Option>
                  </Select>
                </div>
              </div>

              <Table
                columns={leaderboardColumns}
                dataSource={leaderboards}
                rowKey="userId"
                loading={loading}
                pagination={{
                  pageSize: 20,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`
                }}
              />
            </TabPane>

            <TabPane tab="Hall of Fame" key="hall_of_fame">
              <Row gutter={16}>
                <Col span={8}>
                  <Card title="🥇 Top Inviter" className="text-center">
                    <Avatar size={80} className="bg-yellow-500 mb-4">
                      {leaderboards[0]?.username.charAt(0)}
                    </Avatar>
                    <div className="font-bold text-lg">{leaderboards[0]?.username}</div>
                    <div className="text-2xl font-bold text-yellow-600">{leaderboards[0]?.score}</div>
                    <div className="text-sm text-gray-500">lời mời thành công</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="🥈 Top Sharer" className="text-center">
                    <Avatar size={80} className="bg-gray-500 mb-4">
                      {leaderboards[1]?.username.charAt(0)}
                    </Avatar>
                    <div className="font-bold text-lg">{leaderboards[1]?.username}</div>
                    <div className="text-2xl font-bold text-gray-600">{leaderboards[1]?.score}</div>
                    <div className="text-sm text-gray-500">lượt chia sẻ</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="🥉 Top Reviewer" className="text-center">
                    <Avatar size={80} className="bg-amber-600 mb-4">
                      {leaderboards[2]?.username.charAt(0)}
                    </Avatar>
                    <div className="font-bold text-lg">{leaderboards[2]?.username}</div>
                    <div className="text-2xl font-bold text-amber-600">{leaderboards[2]?.score}</div>
                    <div className="text-sm text-gray-500">đánh giá chất lượng</div>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* Campaign Modal */}
      <Modal
        title={isEditing ? 'Chỉnh sửa chiến dịch' : 'Tạo chiến dịch mới'}
        open={campaignModalVisible}
        onCancel={() => {
          setCampaignModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitCampaign}
        >
          <Form.Item
            label="Tên chiến dịch"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên chiến dịch' }]}
          >
            <Input placeholder="Nhập tên chiến dịch" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={3} placeholder="Nhập mô tả chiến dịch" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Loại chiến dịch"
                name="type"
                rules={[{ required: true, message: 'Vui lòng chọn loại chiến dịch' }]}
              >
                <Select placeholder="Chọn loại chiến dịch">
                  <Option value="referral">Giới thiệu</Option>
                  <Option value="sharing">Chia sẻ</Option>
                  <Option value="group_challenge">Thử thách nhóm</Option>
                  <Option value="invite_contest">Cuộc thi mời bạn</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Tạm ngưng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày bắt đầu"
                name="startDate"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày kết thúc"
                name="endDate"
                rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Chỉ số mục tiêu"
                name="targetMetric"
                rules={[{ required: true, message: 'Vui lòng nhập chỉ số mục tiêu' }]}
              >
                <Input placeholder="VD: referrals, shares, etc." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giá trị mục tiêu"
                name="targetValue"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị mục tiêu' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {isEditing ? 'Cập nhật' : 'Tạo chiến dịch'}
              </Button>
              <Button onClick={() => {
                setCampaignModalVisible(false);
                form.resetFields();
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Campaign Detail Drawer */}
      <Drawer
        title="Chi tiết chiến dịch"
        width={600}
        open={campaignDetailVisible}
        onClose={() => setCampaignDetailVisible(false)}
      >
        {selectedCampaign && (
          <div className="space-y-6">
            <Descriptions title="Thông tin chiến dịch" bordered>
              <Descriptions.Item label="Tên chiến dịch" span={2}>
                {selectedCampaign.name}
              </Descriptions.Item>
              <Descriptions.Item label="Loại">
                <Tag color={getCampaignTypeColor(selectedCampaign.type)}>
                  {getCampaignTypeLabel(selectedCampaign.type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getCampaignStatusColor(selectedCampaign.status)}>
                  {getCampaignStatusLabel(selectedCampaign.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian bắt đầu">
                {new Date(selectedCampaign.startDate).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian kết thúc">
                {new Date(selectedCampaign.endDate).toLocaleString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedCampaign.description}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Tiến độ" size="small">
              <div className="text-center mb-4">
                <Progress
                  type="circle"
                  percent={Math.round((selectedCampaign.currentValue / selectedCampaign.targetValue) * 100)}
                  size={120}
                  strokeColor="#52c41a"
                  format={() => `${selectedCampaign.currentValue}/${selectedCampaign.targetValue}`}
                />
              </div>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Hiện tại"
                    value={selectedCampaign.currentValue}
                    prefix={<RiseOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Người tham gia"
                    value={selectedCampaign.participantCount}
                    prefix={<UserOutlined />}
                  />
                </Col>
              </Row>
            </Card>

            <Card title="Phần thưởng" size="small">
              <List
                itemLayout="horizontal"
                dataSource={selectedCampaign.rewards}
                renderItem={(reward) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<GiftOutlined className="text-purple-500" />}
                      title={reward.description}
                      description={`${reward.value.toLocaleString('vi-VN')} ${reward.type === 'cash' ? 'đ' : reward.type === 'points' ? 'điểm' : ''}`}
                    />
                  </List.Item>
                )}
              />
            </Card>

            <Card title="Quy tắc" size="small">
              <List
                itemLayout="horizontal"
                dataSource={selectedCampaign.rules}
                renderItem={(rule, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Badge count={index + 1} />}
                      description={rule}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        )}
      </Drawer>
    </motion.div>
  );
};

export default ViralCampaignComponent; 