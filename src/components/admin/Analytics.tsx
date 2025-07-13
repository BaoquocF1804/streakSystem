import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Select, 
  DatePicker, 
  Table, 
  List, 
  Avatar, 
  Tag, 
  Progress, 
  Button,
  Space,
  Divider,
  Typography,
  Timeline,
  Badge
} from 'antd';
import { 
  UserOutlined, 
  RocketOutlined, 
  GiftOutlined, 
  TrophyOutlined, 
  FireOutlined,
  TeamOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  ReloadOutlined,
  DownloadOutlined,
  CalendarOutlined,
  DollarOutlined,
  StarOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../stores/adminStore';
import { AdminAnalytics, AdminDashboardStats, AdminActivity } from '../../types/admin';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [dateRange, setDateRange] = useState<any[]>([]);

  const {
    analytics,
    dashboardStats,
    loading,
    fetchAnalytics,
    fetchDashboardStats
  } = useAdminStore();

  useEffect(() => {
    fetchAnalytics();
    fetchDashboardStats();
  }, []);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    // In real app, this would filter data by period
    fetchAnalytics();
  };

  const handleDateRangeChange = (dates: any[]) => {
    setDateRange(dates);
    // In real app, this would filter data by date range
    fetchAnalytics();
  };

  const getChangeColor = (change: number) => {
    return change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-500';
  };

  const getChangeIcon = (change: number) => {
    return change > 0 ? <ArrowUpOutlined /> : change < 0 ? <ArrowDownOutlined /> : null;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderOverviewStats = () => (
    <Row gutter={16} className="mb-6">
      <Col span={6}>
        <Card>
          <Statistic
            title="Total Users"
            value={analytics?.users.total || 0}
            prefix={<UserOutlined className="text-blue-500" />}
            formatter={(value) => formatNumber(Number(value))}
          />
          <div className="mt-2">
            <Text className="text-green-500">
              <ArrowUpOutlined /> +{analytics?.users.new || 0} new
            </Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Daily Active Users"
            value={analytics?.users.dau || 0}
            prefix={<TeamOutlined className="text-green-500" />}
            formatter={(value) => formatNumber(Number(value))}
          />
          <div className="mt-2">
            <Text className="text-gray-500">
              MAU: {formatNumber(analytics?.users.mau || 0)}
            </Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
                     <Statistic
             title="Total Game Plays"
             value={analytics?.games.totalPlays || 0}
             prefix={<RocketOutlined className="text-purple-500" />}
             formatter={(value) => formatNumber(Number(value))}
           />
          <div className="mt-2">
            <Text className="text-blue-500">
              Today: {analytics?.games.dailyPlays || 0}
            </Text>
          </div>
        </Card>
      </Col>
      <Col span={6}>
        <Card>
          <Statistic
            title="Vouchers Used"
            value={analytics?.vouchers.used || 0}
            prefix={<GiftOutlined className="text-orange-500" />}
            formatter={(value) => formatNumber(Number(value))}
          />
          <div className="mt-2">
            <Text className="text-orange-500">
              Rate: {analytics?.vouchers.usageRate?.toFixed(1) || 0}%
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );

  const renderTodayStats = () => (
    <Card title="Today's Statistics" className="mb-6">
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small" className="text-center">
            <Statistic
              title="New Users"
              value={dashboardStats?.todayStats.newUsers || 0}
              prefix={<UserOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" className="text-center">
            <Statistic
              title="Active Users"
              value={dashboardStats?.todayStats.activeUsers || 0}
              prefix={<TeamOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" className="text-center">
                         <Statistic
               title="Games Played"
               value={dashboardStats?.todayStats.gamesPlayed || 0}
               prefix={<RocketOutlined className="text-purple-500" />}
             />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" className="text-center">
            <Statistic
              title="Revenue"
              value={dashboardStats?.todayStats.revenue || 0}
              prefix={<DollarOutlined className="text-yellow-500" />}
              formatter={(value) => `${formatNumber(Number(value))}đ`}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );

  const renderEngagementMetrics = () => (
    <Card title="Engagement Metrics" className="mb-6">
      <Row gutter={16}>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {analytics?.engagement.averageStreak?.toFixed(1) || 0}
            </div>
            <div className="text-sm text-gray-600">Average Streak</div>
            <Progress 
              percent={Math.min((analytics?.engagement.averageStreak || 0) * 10, 100)} 
              showInfo={false}
              strokeColor="#1890ff"
            />
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {analytics?.engagement.achievementsUnlocked || 0}
            </div>
            <div className="text-sm text-gray-600">Achievements Unlocked</div>
            <Progress 
              percent={Math.min((analytics?.engagement.achievementsUnlocked || 0) / 10, 100)} 
              showInfo={false}
              strokeColor="#52c41a"
            />
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {analytics?.engagement.multiplayerMatches || 0}
            </div>
            <div className="text-sm text-gray-600">Multiplayer Matches</div>
            <Progress 
              percent={Math.min((analytics?.engagement.multiplayerMatches || 0) / 5, 100)} 
              showInfo={false}
              strokeColor="#722ed1"
            />
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderTopUsers = () => (
    <Card title="Top Users" className="mb-6">
      <div className="space-y-4">
        <div>
          <Title level={5}>By Points</Title>
          <List
            dataSource={dashboardStats?.topUsers.byPoints?.slice(0, 5) || []}
            renderItem={(user, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Badge count={index + 1} size="small">
                      <Avatar src={user.avatar} icon={<UserOutlined />} />
                    </Badge>
                  }
                  title={user.username}
                  description={`${user.totalPoints.toLocaleString()} points`}
                />
                <div>
                  <Tag color="gold">
                    <TrophyOutlined /> Level {user.level}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </div>
        
        <Divider />
        
        <div>
          <Title level={5}>By Streak</Title>
          <List
            dataSource={dashboardStats?.topUsers.byStreak?.slice(0, 5) || []}
            renderItem={(user, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Badge count={index + 1} size="small">
                      <Avatar src={user.avatar} icon={<UserOutlined />} />
                    </Badge>
                  }
                  title={user.username}
                  description={`${user.currentStreak} day streak`}
                />
                <div>
                  <Tag color="orange">
                    <FireOutlined /> {user.currentStreak} days
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </Card>
  );

  const renderTopGames = () => (
    <Card title="Top Games" className="mb-6">
      <div className="space-y-4">
        <div>
          <Title level={5}>By Play Count</Title>
          <List
            dataSource={dashboardStats?.topGames.byPlays?.slice(0, 5) || []}
            renderItem={(game, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Badge count={index + 1} size="small">
                      <Avatar className="bg-blue-500">{game.icon}</Avatar>
                    </Badge>
                  }
                  title={game.name}
                  description={`${game.playCount.toLocaleString()} plays`}
                />
                <div>
                  <Tag color={game.status === 'active' ? 'green' : 'orange'}>
                    {game.status}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </div>
        
        <Divider />
        
        <div>
          <Title level={5}>By Average Score</Title>
          <List
            dataSource={dashboardStats?.topGames.byScore?.slice(0, 5) || []}
            renderItem={(game, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Badge count={index + 1} size="small">
                      <Avatar className="bg-purple-500">{game.icon}</Avatar>
                    </Badge>
                  }
                  title={game.name}
                  description={`Avg: ${game.averageScore.toFixed(0)} points`}
                />
                <div>
                  <Tag color="purple">
                    <StarOutlined /> {game.averageScore.toFixed(0)}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </Card>
  );

  const renderRecentActivity = () => (
    <Card title="Recent Activity" className="mb-6">
      <Timeline>
        {dashboardStats?.recentActivities?.slice(0, 10).map((activity) => (
          <Timeline.Item
            key={activity.id}
            color={
              activity.type === 'user_register' ? 'green' :
              activity.type === 'game_played' ? 'blue' :
              activity.type === 'voucher_used' ? 'orange' :
              activity.type === 'achievement_unlocked' ? 'purple' :
              'gray'
            }
          >
            <div>
              <div className="font-medium">{activity.description}</div>
              <div className="text-sm text-gray-500">
                by {activity.username} • {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );

  const renderUserAnalytics = () => (
    <Card title="User Analytics" className="mb-6">
      <Row gutter={16}>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {analytics?.users.total || 0}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {analytics?.users.active || 0}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">
              {analytics?.users.banned || 0}
            </div>
            <div className="text-sm text-gray-600">Banned Users</div>
          </div>
        </Col>
      </Row>
      
      <Divider />
      
      <Row gutter={16}>
        <Col span={12}>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-500">
              {analytics?.users.dau || 0}
            </div>
            <div className="text-sm text-gray-600">Daily Active Users</div>
            <Progress 
              percent={analytics?.users.dau ? (analytics.users.dau / analytics.users.total) * 100 : 0}
              showInfo={false}
              strokeColor="#722ed1"
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-500">
              {analytics?.users.mau || 0}
            </div>
            <div className="text-sm text-gray-600">Monthly Active Users</div>
            <Progress 
              percent={analytics?.users.mau ? (analytics.users.mau / analytics.users.total) * 100 : 0}
              showInfo={false}
              strokeColor="#fa8c16"
            />
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderGameAnalytics = () => (
    <Card title="Game Analytics" className="mb-6">
      <Row gutter={16}>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {analytics?.games.totalPlays || 0}
            </div>
            <div className="text-sm text-gray-600">Total Plays</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {analytics?.games.uniquePlayers || 0}
            </div>
            <div className="text-sm text-gray-600">Unique Players</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {analytics?.games.averageScore?.toFixed(0) || 0}
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </Col>
      </Row>
      
      <Divider />
      
      <Row gutter={16}>
        <Col span={12}>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-500">
              {analytics?.games.dailyPlays || 0}
            </div>
            <div className="text-sm text-gray-600">Daily Plays</div>
            <Progress 
              percent={analytics?.games.dailyPlays ? (analytics.games.dailyPlays / analytics.games.totalPlays) * 100 : 0}
              showInfo={false}
              strokeColor="#fa8c16"
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="text-center">
            <div className="text-lg font-bold text-red-500">
              {analytics?.games.averagePlayTime || 0}s
            </div>
            <div className="text-sm text-gray-600">Average Play Time</div>
            <Progress 
              percent={analytics?.games.averagePlayTime ? Math.min((analytics.games.averagePlayTime / 300) * 100, 100) : 0}
              showInfo={false}
              strokeColor="#ff4d4f"
            />
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderVoucherAnalytics = () => (
    <Card title="Voucher Analytics" className="mb-6">
      <Row gutter={16}>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {analytics?.vouchers.total || 0}
            </div>
            <div className="text-sm text-gray-600">Total Vouchers</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {analytics?.vouchers.distributed || 0}
            </div>
            <div className="text-sm text-gray-600">Distributed</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {analytics?.vouchers.used || 0}
            </div>
            <div className="text-sm text-gray-600">Used</div>
          </div>
        </Col>
      </Row>
      
      <Divider />
      
      <Row gutter={16}>
        <Col span={12}>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-500">
              {analytics?.vouchers.usageRate?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-gray-600">Usage Rate</div>
            <Progress 
              percent={analytics?.vouchers.usageRate || 0}
              showInfo={false}
              strokeColor="#fa8c16"
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="text-center">
            <div className="text-lg font-bold text-red-500">
              {analytics?.vouchers.expired || 0}
            </div>
            <div className="text-sm text-gray-600">Expired</div>
            <Progress 
              percent={analytics?.vouchers.expired ? (analytics.vouchers.expired / analytics.vouchers.total) * 100 : 0}
              showInfo={false}
              strokeColor="#ff4d4f"
            />
          </div>
        </Col>
      </Row>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title level={2} className="text-gray-800 m-0">Analytics Dashboard</Title>
            <Text className="text-gray-600">Comprehensive analytics and insights</Text>
          </div>
          <Space>
            <Select
              value={selectedPeriod}
              onChange={handlePeriodChange}
              style={{ width: 120 }}
            >
              <Option value="day">Today</Option>
              <Option value="week">This Week</Option>
              <Option value="month">This Month</Option>
              <Option value="year">This Year</Option>
            </Select>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              style={{ width: 240 }}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                fetchAnalytics();
                fetchDashboardStats();
              }}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              icon={<DownloadOutlined />}
              type="primary"
            >
              Export
            </Button>
          </Space>
        </div>
      </div>

      {renderOverviewStats()}
      {renderTodayStats()}
      
      <Row gutter={16} className="mb-6">
        <Col span={16}>
          {renderEngagementMetrics()}
          {renderUserAnalytics()}
          {renderGameAnalytics()}
          {renderVoucherAnalytics()}
        </Col>
        <Col span={8}>
          {renderTopUsers()}
          {renderTopGames()}
          {renderRecentActivity()}
        </Col>
      </Row>
    </motion.div>
  );
};

export default Analytics; 