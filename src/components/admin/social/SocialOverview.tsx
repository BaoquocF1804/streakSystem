import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Avatar, 
  Tag, 
  List, 
  Timeline, 
  Button,
  Space,
  Tooltip,
  Badge,
  Tabs,
  Select,
  DatePicker
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  ShareAltOutlined, 
  MessageOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  LikeOutlined,
  StarOutlined,
  GiftOutlined,
  FireOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  PercentageOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
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
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { useSocialStore } from '../../../stores/socialStore';
import { SocialActivity } from '../../../types/social';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SocialOverview: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('overall');

  const {
    overview,
    analytics,
    recentActivities,
    loading,
    fetchSocialOverview,
    fetchSocialAnalytics
  } = useSocialStore();

  useEffect(() => {
    fetchSocialOverview();
    fetchSocialAnalytics();
  }, []);

  const getActivityIcon = (type: SocialActivity['type']) => {
    switch (type) {
      case 'group_created': return <TeamOutlined className="text-blue-500" />;
      case 'member_joined': return <UserOutlined className="text-green-500" />;
      case 'product_shared': return <ShareAltOutlined className="text-purple-500" />;
      case 'review_posted': return <MessageOutlined className="text-orange-500" />;
      case 'invite_sent': return <UserOutlined className="text-blue-500" />;
      case 'friend_connected': return <HeartOutlined className="text-red-500" />;
      default: return <ClockCircleOutlined className="text-gray-500" />;
    }
  };

  const getActivityColor = (type: SocialActivity['type']) => {
    switch (type) {
      case 'group_created': return 'blue';
      case 'member_joined': return 'green';
      case 'product_shared': return 'purple';
      case 'review_posted': return 'orange';
      case 'invite_sent': return 'blue';
      case 'friend_connected': return 'red';
      default: return 'default';
    }
  };

  // Chart data
  const engagementTrendData = {
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
    datasets: [
      {
        label: 'Hoạt động nhóm',
        data: [45, 52, 48, 61, 55, 67, 73],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Chia sẻ sản phẩm',
        data: [28, 35, 42, 38, 45, 51, 48],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Lời mời bạn bè',
        data: [18, 25, 22, 30, 28, 35, 32],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const userEngagementData = {
    labels: ['Rất tích cực', 'Tích cực', 'Trung bình', 'Ít tích cực', 'Không hoạt động'],
    datasets: [
      {
        data: [25, 35, 20, 15, 5],
        backgroundColor: [
          '#52c41a',
          '#1890ff',
          '#faad14',
          '#ff7875',
          '#d9d9d9'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const conversionFunnelData = {
    labels: ['Truy cập', 'Xem sản phẩm', 'Chia sẻ', 'Click', 'Mua hàng'],
    datasets: [
      {
        label: 'Số lượng',
        data: [1000, 650, 420, 280, 95],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ],
        borderColor: [
          'rgb(54, 162, 235)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(255, 99, 132)',
          'rgb(153, 102, 255)'
        ],
        borderWidth: 1
      }
    ]
  };

  const socialChannelData = {
    labels: ['Nhóm mua chung', 'Bạn bè', 'Mạng xã hội', 'Link trực tiếp'],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: [
          '#1890ff',
          '#52c41a',
          '#722ed1',
          '#faad14'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Mock previous data for growth calculation
  const mockPreviousData = {
    groups: 145,
    friends: 4234,
    shares: 1089,
    reviews: 798
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Social Commerce Hub</h1>
            <p className="text-gray-600">Tổng quan hoạt động xã hội và thương mại</p>
          </div>
          <Space>
            <Select
              defaultValue="7days"
              style={{ width: 120 }}
              onChange={setSelectedPeriod}
            >
              <Option value="today">Hôm nay</Option>
              <Option value="7days">7 ngày</Option>
              <Option value="30days">30 ngày</Option>
              <Option value="90days">90 ngày</Option>
            </Select>
            <RangePicker size="small" />
          </Space>
        </div>

        {/* Key Metrics */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Tổng nhóm hoạt động</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics?.groups.active || 0}
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpOutlined className="text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">
                      +{calculateGrowth(analytics?.groups.active || 0, mockPreviousData.groups).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-4xl text-blue-500">
                  <TeamOutlined />
                </div>
              </div>
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Bạn kết nối hôm nay</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics?.friends.newConnectionsToday || 0}
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpOutlined className="text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">
                      +{calculateGrowth(analytics?.friends.newConnectionsToday || 0, 18).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-4xl text-green-500">
                  <UserOutlined />
                </div>
              </div>
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Sản phẩm share nhiều nhất</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics?.sharing.topProduct?.totalShares || 0}
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpOutlined className="text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">
                      +{calculateGrowth(analytics?.sharing.topProduct?.totalShares || 0, 45).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-4xl text-purple-500">
                  <ShareAltOutlined />
                </div>
              </div>
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Tỷ lệ chuyển đổi</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {analytics?.sharing.conversionRate.toFixed(1) || 0}%
                  </div>
                  <div className="flex items-center mt-2">
                    <ArrowUpOutlined className="text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">
                      +{calculateGrowth(analytics?.sharing.conversionRate || 0, 18.5).toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-4xl text-orange-500">
                  <PercentageOutlined />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Main Charts */}
        <Row gutter={16}>
          <Col span={16}>
            <Card title="Xu hướng hoạt động 7 ngày" extra={
              <Select defaultValue="overall" size="small" onChange={setSelectedMetric}>
                <Option value="overall">Tổng quan</Option>
                <Option value="groups">Nhóm</Option>
                <Option value="sharing">Chia sẻ</Option>
                <Option value="invites">Lời mời</Option>
              </Select>
            }>
              <div style={{ height: 300 }}>
                <Line data={engagementTrendData} options={chartOptions} />
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Mức độ tham gia người dùng">
              <div style={{ height: 300 }}>
                <Doughnut data={userEngagementData} options={pieChartOptions} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Secondary Charts */}
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Phễu chuyển đổi">
              <div style={{ height: 250 }}>
                <Bar data={conversionFunnelData} options={chartOptions} />
              </div>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Kênh chia sẻ">
              <div style={{ height: 250 }}>
                <Pie data={socialChannelData} options={pieChartOptions} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Content Sections */}
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Top 3 nhóm active nhất" extra={<Button type="link" size="small">Xem tất cả</Button>}>
              <List
                itemLayout="horizontal"
                dataSource={overview?.topGroups.slice(0, 3)}
                renderItem={(group, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Badge count={index + 1} color={index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}>
                          <Avatar size={40} src={group.avatar} className="bg-blue-500">
                            {group.name.charAt(0)}
                          </Avatar>
                        </Badge>
                      }
                      title={<span className="font-medium">{group.name}</span>}
                      description={
                        <div className="text-sm">
                          <div>{group.memberCount} thành viên</div>
                          <div className="text-green-500">{group.interactions7d} tương tác/7d</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Top user viral" extra={<Button type="link" size="small">Xem bảng xếp hạng</Button>}>
              <List
                itemLayout="horizontal"
                dataSource={overview?.topInviteUsers.slice(0, 3)}
                renderItem={(user, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Badge count={index + 1} color={index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}>
                          <Avatar size={40} className="bg-purple-500">
                            {user.username.charAt(0)}
                          </Avatar>
                        </Badge>
                      }
                      title={<span className="font-medium">{user.username}</span>}
                      description={
                        <div className="text-sm">
                          <div>{user.totalInvitesSent} lời mời</div>
                          <div className="text-green-500">{user.successRate.toFixed(1)}% thành công</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Sản phẩm hot nhất" extra={<Button type="link" size="small">Xem chi tiết</Button>}>
              <List
                itemLayout="horizontal"
                dataSource={overview?.topSharedProducts.slice(0, 3)}
                renderItem={(product, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Badge count={index + 1} color={index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}>
                          <Avatar size={40} shape="square" className="bg-orange-500">
                            {product.productName.charAt(0)}
                          </Avatar>
                        </Badge>
                      }
                      title={<span className="font-medium">{product.productName}</span>}
                      description={
                        <div className="text-sm">
                          <div>{product.totalShares} lượt share</div>
                          <div className="text-green-500">{product.conversionRate.toFixed(1)}% chuyển đổi</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Card 
          title="Hoạt động gần đây" 
          extra={<Button type="link" size="small">Xem tất cả</Button>}
        >
          <Timeline>
            {recentActivities.slice(0, 8).map((activity) => (
              <Timeline.Item 
                key={activity.id}
                dot={getActivityIcon(activity.type)}
                color={getActivityColor(activity.type)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{activity.username}</div>
                    <div className="text-sm text-gray-600">{activity.description}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString('vi-VN')}
                  </div>
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>

        {/* Performance Metrics */}
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Hiệu suất nhóm">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Tỷ lệ nhóm hoạt động</span>
                  <span className="font-medium">
                    {analytics && ((analytics.groups.active / analytics.groups.total) * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  percent={analytics ? (analytics.groups.active / analytics.groups.total) * 100 : 0} 
                  strokeColor="#52c41a"
                  size="small"
                />
                
                <div className="flex items-center justify-between">
                  <span>Số thành viên trung bình</span>
                  <span className="font-medium">{analytics?.groups.averageMembers || 0}</span>
                </div>
                <Progress 
                  percent={analytics ? (analytics.groups.averageMembers / 50) * 100 : 0} 
                  strokeColor="#1890ff"
                  size="small"
                />
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Hiệu suất chia sẻ">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Tỷ lệ chuyển đổi</span>
                  <span className="font-medium">{analytics?.sharing.conversionRate.toFixed(1) || 0}%</span>
                </div>
                <Progress 
                  percent={analytics?.sharing.conversionRate || 0} 
                  strokeColor="#722ed1"
                  size="small"
                />
                
                <div className="flex items-center justify-between">
                  <span>Clicks hôm nay</span>
                  <span className="font-medium">{analytics?.sharing.clicksToday || 0}</span>
                </div>
                <Progress 
                  percent={analytics ? (analytics.sharing.clicksToday / 500) * 100 : 0} 
                  strokeColor="#faad14"
                  size="small"
                />
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Hiệu suất review">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Điểm đánh giá trung bình</span>
                  <span className="font-medium">{analytics?.reviews.averageRating.toFixed(1) || 0}/5</span>
                </div>
                <Progress 
                  percent={analytics ? (analytics.reviews.averageRating / 5) * 100 : 0} 
                  strokeColor="#faad14"
                  size="small"
                />
                
                <div className="flex items-center justify-between">
                  <span>Review hôm nay</span>
                  <span className="font-medium">{analytics?.reviews.newToday || 0}</span>
                </div>
                <Progress 
                  percent={analytics ? (analytics.reviews.newToday / 50) * 100 : 0} 
                  strokeColor="#52c41a"
                  size="small"
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card title="Thao tác nhanh">
          <div className="grid grid-cols-4 gap-4">
            <Button type="primary" icon={<TeamOutlined />} size="large">
              Tạo nhóm mới
            </Button>
            <Button type="primary" icon={<GiftOutlined />} size="large">
              Tạo chiến dịch
            </Button>
            <Button type="primary" icon={<MessageOutlined />} size="large">
              Duyệt reviews
            </Button>
            <Button type="primary" icon={<TrophyOutlined />} size="large">
              Xem bảng xếp hạng
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default SocialOverview; 