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
  Image,
  Badge,
  message,
  Tabs,
  List,
  Descriptions
} from 'antd';
import { 
  ShareAltOutlined, 
  SearchOutlined, 
  FilterOutlined,
  ReloadOutlined,
  ExportOutlined,
  TrophyOutlined,
  PercentageOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  BarChartOutlined,
  LinkOutlined,
  UserOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined
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
import { ProductShare, ProductSharingStats } from '../../../types/social';
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

const ProductSharingAnalytics: React.FC = () => {
  const [shareDetailVisible, setShareDetailVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductSharingStats | null>(null);

  const {
    productShares,
    productSharingStats,
    loading,
    fetchProductShares,
    fetchSharingStats,
    getShareAnalytics
  } = useSocialStore();

  useEffect(() => {
    fetchProductShares();
    fetchSharingStats();
  }, []);

  const handleViewShareDetail = async (productId: string) => {
    const stats = await getShareAnalytics(productId);
    setSelectedProduct(stats);
    setShareDetailVisible(true);
  };

  const getShareChannelColor = (channel: ProductShare['shareChannel']) => {
    switch (channel) {
      case 'group': return 'blue';
      case 'friend': return 'green';
      case 'social_media': return 'purple';
      case 'direct_link': return 'orange';
      default: return 'default';
    }
  };

  const getShareChannelLabel = (channel: ProductShare['shareChannel']) => {
    switch (channel) {
      case 'group': return 'Nhóm';
      case 'friend': return 'Bạn bè';
      case 'social_media': return 'Mạng xã hội';
      case 'direct_link': return 'Link trực tiếp';
      default: return channel;
    }
  };

  const shareColumns: ColumnsType<ProductShare> = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
      width: 60
    },
    {
      title: 'Sản phẩm',
      render: (_, record: ProductShare) => (
        <div className="flex items-center space-x-3">
          <Image
            width={50}
            height={50}
            src={record.productImage}
            alt={record.productName}
            className="rounded-lg object-cover"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
          />
          <div>
            <div className="font-medium">{record.productName}</div>
            <div className="text-xs text-gray-500">ID: {record.productId}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Người chia sẻ',
      render: (_, record: ProductShare) => (
        <div className="flex items-center space-x-2">
          <Avatar size={32} className="bg-blue-500">
            {record.sharerName.charAt(0)}
          </Avatar>
          <span className="font-medium">{record.sharerName}</span>
        </div>
      )
    },
    {
      title: 'Kênh chia sẻ',
      dataIndex: 'shareChannel',
      key: 'shareChannel',
      render: (channel: ProductShare['shareChannel']) => (
        <Tag color={getShareChannelColor(channel)}>
          {getShareChannelLabel(channel)}
        </Tag>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'sharedAt',
      key: 'sharedAt',
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
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
      render: (count: number) => (
        <div className="text-center">
          <div className="font-medium">{count}</div>
          <EyeOutlined className="text-gray-400" />
        </div>
      ),
      sorter: (a, b) => a.viewCount - b.viewCount
    },
    {
      title: 'Lượt click',
      dataIndex: 'clickCount',
      key: 'clickCount',
      render: (count: number) => (
        <div className="text-center">
          <div className="font-medium">{count}</div>
          <LinkOutlined className="text-blue-500" />
        </div>
      ),
      sorter: (a, b) => a.clickCount - b.clickCount
    },
    {
      title: 'Lượt mua',
      dataIndex: 'purchaseCount',
      key: 'purchaseCount',
      render: (count: number) => (
        <div className="text-center">
          <div className="font-medium text-green-600">{count}</div>
          <ShoppingCartOutlined className="text-green-500" />
        </div>
      ),
      sorter: (a, b) => a.purchaseCount - b.purchaseCount
    },
    {
      title: 'Tỷ lệ chuyển đổi',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      render: (rate: number) => (
        <div className="text-center">
          <Progress 
            type="circle" 
            percent={rate} 
            size={40}
            strokeColor={rate >= 20 ? '#52c41a' : rate >= 10 ? '#faad14' : '#ff4d4f'}
            format={(percent) => `${percent}%`}
          />
        </div>
      ),
      sorter: (a, b) => a.conversionRate - b.conversionRate
    },
    {
      title: 'Doanh thu',
      dataIndex: 'earnings',
      key: 'earnings',
      render: (earnings: number) => (
        <div className="text-center">
          <div className="font-medium text-green-600">
            {earnings.toLocaleString('vi-VN')}đ
          </div>
          <DollarOutlined className="text-green-500" />
        </div>
      ),
      sorter: (a, b) => a.earnings - b.earnings
    }
  ];

  const statsColumns: ColumnsType<ProductSharingStats> = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
      width: 60
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (name: string) => (
        <div className="font-medium">{name}</div>
      )
    },
    {
      title: 'Số lượt share',
      dataIndex: 'totalShares',
      key: 'totalShares',
      render: (shares: number, record: ProductSharingStats) => (
        <div className="text-center">
          <div className="font-medium text-lg">{shares}</div>
          <div className="text-xs text-gray-500">
            <span className="text-green-500">+{record.weeklyShares}</span> tuần này
          </div>
        </div>
      ),
      sorter: (a, b) => a.totalShares - b.totalShares
    },
    {
      title: 'Top sharer',
      dataIndex: 'topSharer',
      key: 'topSharer',
      render: (sharer: string) => (
        <div className="flex items-center space-x-2">
          <Avatar size={24} className="bg-purple-500">
            {sharer.charAt(0)}
          </Avatar>
          <span className="font-medium">{sharer}</span>
        </div>
      )
    },
    {
      title: 'Số click từ link',
      dataIndex: 'totalClicks',
      key: 'totalClicks',
      render: (clicks: number) => (
        <div className="text-center">
          <div className="font-medium">{clicks}</div>
          <LinkOutlined className="text-blue-500" />
        </div>
      ),
      sorter: (a, b) => a.totalClicks - b.totalClicks
    },
    {
      title: 'Tỷ lệ mua qua link',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      render: (rate: number) => (
        <div className="text-center">
          <div className="font-medium text-lg">{rate.toFixed(1)}%</div>
          <Progress 
            percent={rate} 
            size="small" 
            showInfo={false}
            strokeColor={rate >= 20 ? '#52c41a' : rate >= 10 ? '#faad14' : '#ff4d4f'}
          />
        </div>
      ),
      sorter: (a, b) => a.conversionRate - b.conversionRate
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalEarnings',
      key: 'totalEarnings',
      render: (earnings: number) => (
        <div className="text-center">
          <div className="font-medium text-green-600">
            {earnings.toLocaleString('vi-VN')}đ
          </div>
        </div>
      ),
      sorter: (a, b) => a.totalEarnings - b.totalEarnings
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record: ProductSharingStats) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => handleViewShareDetail(record.productId)}
            />
          </Tooltip>
          <Tooltip title="Phân tích">
            <Button 
              type="text" 
              icon={<BarChartOutlined />}
              onClick={() => {
                // Handle analytics
              }}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  // Chart data
  const sharingTrendData = {
    labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
    datasets: [
      {
        label: 'Số lượt share',
        data: [65, 75, 80, 85],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'Tỷ lệ chuyển đổi (%)',
        data: [15, 18, 20, 22],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }
    ]
  };

  const shareChannelData = {
    labels: ['Nhóm', 'Bạn bè', 'Mạng xã hội', 'Link trực tiếp'],
    datasets: [
      {
        data: [
          productShares.filter(s => s.shareChannel === 'group').length,
          productShares.filter(s => s.shareChannel === 'friend').length,
          productShares.filter(s => s.shareChannel === 'social_media').length,
          productShares.filter(s => s.shareChannel === 'direct_link').length
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

  const topProductsData = {
    labels: productSharingStats.slice(0, 5).map(p => p.productName),
    datasets: [
      {
        label: 'Lượt share',
        data: productSharingStats.slice(0, 5).map(p => p.totalShares),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  const conversionRateData = {
    labels: productSharingStats.slice(0, 5).map(p => p.productName),
    datasets: [
      {
        label: 'Tỷ lệ chuyển đổi (%)',
        data: productSharingStats.slice(0, 5).map(p => p.conversionRate),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
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

  const totalShares = productSharingStats.reduce((sum, stat) => sum + stat.totalShares, 0);
  const totalClicks = productSharingStats.reduce((sum, stat) => sum + stat.totalClicks, 0);
  const totalEarnings = productSharingStats.reduce((sum, stat) => sum + stat.totalEarnings, 0);
  const avgConversionRate = productSharingStats.length > 0 
    ? productSharingStats.reduce((sum, stat) => sum + stat.conversionRate, 0) / productSharingStats.length
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
              <h2 className="text-2xl font-bold text-gray-800">Product Sharing Analytics</h2>
              <p className="text-gray-600">Phân tích chia sẻ sản phẩm và hiệu quả chuyển đổi</p>
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  fetchProductShares();
                  fetchSharingStats();
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
                  title="Tổng lượt share"
                  value={totalShares}
                  prefix={<ShareAltOutlined className="text-blue-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Tổng clicks"
                  value={totalClicks}
                  prefix={<LinkOutlined className="text-green-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Tỷ lệ chuyển đổi TB"
                  value={avgConversionRate.toFixed(1)}
                  suffix="%"
                  prefix={<PercentageOutlined className="text-purple-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Doanh thu"
                  value={totalEarnings}
                  formatter={(value) => `${Number(value).toLocaleString('vi-VN')}đ`}
                  prefix={<DollarOutlined className="text-orange-500" />}
                />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Charts */}
        <Card title="Biểu đồ phân tích">
          <Row gutter={16}>
            <Col span={12}>
              <Card size="small" title="Xu hướng chia sẻ">
                <Line data={sharingTrendData} options={chartOptions} />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="Kênh chia sẻ">
                <Pie data={shareChannelData} options={chartOptions} />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} className="mt-4">
            <Col span={12}>
              <Card size="small" title="Top sản phẩm được share">
                <Bar data={topProductsData} options={chartOptions} />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small" title="Tỷ lệ chuyển đổi">
                <Bar data={conversionRateData} options={chartOptions} />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Tables */}
        <Card>
          <Tabs defaultActiveKey="stats">
            <TabPane tab="Thống kê sản phẩm" key="stats">
              <Table
                columns={statsColumns}
                dataSource={productSharingStats}
                rowKey="productId"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`
                }}
              />
            </TabPane>

            <TabPane tab="Chi tiết chia sẻ" key="shares">
              <div className="mb-4">
                <div className="flex flex-wrap gap-4">
                  <Search
                    placeholder="Tìm kiếm sản phẩm..."
                    allowClear
                    style={{ width: 300 }}
                  />
                  
                  <Select
                    placeholder="Kênh chia sẻ"
                    allowClear
                    style={{ width: 150 }}
                  >
                    <Option value="group">Nhóm</Option>
                    <Option value="friend">Bạn bè</Option>
                    <Option value="social_media">Mạng xã hội</Option>
                    <Option value="direct_link">Link trực tiếp</Option>
                  </Select>

                  <RangePicker
                    placeholder={['Từ ngày', 'Đến ngày']}
                  />
                </div>
              </div>

              <Table
                columns={shareColumns}
                dataSource={productShares}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lượt chia sẻ`
                }}
              />
            </TabPane>

            <TabPane tab="Leaderboard" key="leaderboard">
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="Top sản phẩm hot nhất" size="small">
                    <List
                      itemLayout="horizontal"
                      dataSource={productSharingStats.slice(0, 5)}
                      renderItem={(item, index) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Badge count={index + 1} color={index < 3 ? 'gold' : 'blue'}>
                                <Avatar icon={<TrophyOutlined />} />
                              </Badge>
                            }
                            title={item.productName}
                            description={`${item.totalShares} lượt share • ${item.conversionRate.toFixed(1)}% chuyển đổi`}
                          />
                          <div className="text-green-600 font-medium">
                            {item.totalEarnings.toLocaleString('vi-VN')}đ
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Top người chia sẻ" size="small">
                    <List
                      itemLayout="horizontal"
                      dataSource={productSharingStats.slice(0, 5)}
                      renderItem={(item, index) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Badge count={index + 1} color={index < 3 ? 'gold' : 'blue'}>
                                <Avatar className="bg-purple-500">
                                  {item.topSharer.charAt(0)}
                                </Avatar>
                              </Badge>
                            }
                            title={item.topSharer}
                            description={`${item.totalShares} lượt share`}
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </div>

      {/* Share Detail Modal */}
      <Modal
        title="Chi tiết chia sẻ sản phẩm"
        open={shareDetailVisible}
        onCancel={() => setShareDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedProduct && (
          <div className="space-y-4">
            <Descriptions title="Thông tin sản phẩm" bordered>
              <Descriptions.Item label="Tên sản phẩm" span={2}>
                {selectedProduct.productName}
              </Descriptions.Item>
              <Descriptions.Item label="ID sản phẩm">
                {selectedProduct.productId}
              </Descriptions.Item>
              <Descriptions.Item label="Tổng lượt share">
                {selectedProduct.totalShares}
              </Descriptions.Item>
              <Descriptions.Item label="Top sharer">
                {selectedProduct.topSharer}
              </Descriptions.Item>
              <Descriptions.Item label="Tỷ lệ chuyển đổi">
                {selectedProduct.conversionRate.toFixed(1)}%
              </Descriptions.Item>
              <Descriptions.Item label="Doanh thu" span={2}>
                {selectedProduct.totalEarnings.toLocaleString('vi-VN')}đ
              </Descriptions.Item>
            </Descriptions>

            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" title="Hoạt động tuần này">
                  <Statistic
                    title="Lượt share"
                    value={selectedProduct.weeklyShares}
                    prefix={<ShareAltOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Hoạt động tháng này">
                  <Statistic
                    title="Lượt share"
                    value={selectedProduct.monthlyShares}
                    prefix={<ShareAltOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default ProductSharingAnalytics; 