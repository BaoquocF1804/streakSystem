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
  Rate,
  Tooltip,
  Image,
  Badge,
  message,
  Popconfirm,
  Drawer,
  Tabs,
  Progress,
  Divider
} from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckOutlined,
  StopOutlined,
  SearchOutlined, 
  FilterOutlined,
  ReloadOutlined,
  ExportOutlined,
  StarOutlined,
  WarningOutlined,
  MessageOutlined,
  UserOutlined,
  CalendarOutlined,
  LikeOutlined,
  DislikeOutlined,
  FlagOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  PictureOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useSocialStore } from '../../../stores/socialStore';
import { ProductReview } from '../../../types/social';
import type { ColumnsType } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ReviewManagement: React.FC = () => {
  const [reviewDetailVisible, setReviewDetailVisible] = useState(false);
  const [moderationModalVisible, setModerationModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ProductReview | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  const {
    reviews,
    reviewFilter,
    loading,
    fetchReviews,
    updateReviewStatus,
    deleteReview,
    bulkUpdateReviews,
    setReviewFilter
  } = useSocialStore();

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSearch = (value: string) => {
    setReviewFilter({ ...reviewFilter, search: value });
    fetchReviews({ ...reviewFilter, search: value });
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilter = { ...reviewFilter, [key]: value };
    setReviewFilter(newFilter);
    fetchReviews(newFilter);
  };

  const handleViewReview = (review: ProductReview) => {
    setSelectedReview(review);
    setReviewDetailVisible(true);
  };

  const handleModerateReview = (review: ProductReview) => {
    setSelectedReview(review);
    setModerationModalVisible(true);
  };

  const handleUpdateStatus = async (reviewId: string, status: ProductReview['status'], notes?: string) => {
    await updateReviewStatus(reviewId, status, notes);
    message.success(`Review ${status === 'active' ? 'approved' : status === 'hidden' ? 'hidden' : 'updated'} successfully`);
    fetchReviews(reviewFilter);
  };

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId);
    message.success('Review deleted successfully');
    fetchReviews(reviewFilter);
  };

  const handleBulkAction = async (action: ProductReview['status']) => {
    await bulkUpdateReviews(selectedRowKeys as string[], action);
    message.success(`${selectedRowKeys.length} reviews ${action} successfully`);
    setSelectedRowKeys([]);
    fetchReviews(reviewFilter);
  };

  const handleModeration = async (values: any) => {
    if (selectedReview) {
      await updateReviewStatus(selectedReview.id, values.status, values.notes);
      message.success('Review moderated successfully');
      setModerationModalVisible(false);
      form.resetFields();
      fetchReviews(reviewFilter);
    }
  };

  const getStatusColor = (status: ProductReview['status']) => {
    switch (status) {
      case 'active': return 'green';
      case 'hidden': return 'orange';
      case 'reported': return 'red';
      case 'pending': return 'blue';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: ProductReview['status']) => {
    switch (status) {
      case 'active': return 'Hiển thị';
      case 'hidden': return 'Ẩn';
      case 'reported': return 'Báo cáo';
      case 'pending': return 'Chờ duyệt';
      default: return status;
    }
  };

  const getStatusIcon = (status: ProductReview['status']) => {
    switch (status) {
      case 'active': return <CheckOutlined />;
      case 'hidden': return <StopOutlined />;
      case 'reported': return <WarningOutlined />;
      case 'pending': return <ClockCircleOutlined />;
      default: return null;
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'orange';
    return 'red';
  };

  const columns: ColumnsType<ProductReview> = [
    {
      title: 'STT',
      render: (_, __, index) => index + 1,
      width: 60
    },
    {
      title: 'User',
      render: (_, record: ProductReview) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            src={record.userAvatar} 
            className="bg-blue-500"
          >
            {record.username.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{record.username}</div>
            <div className="text-xs text-gray-500">ID: {record.userId}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Sản phẩm',
      render: (_, record: ProductReview) => (
        <div className="flex items-center space-x-3">
          <Image
            width={40}
            height={40}
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
      title: 'Điểm rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <div className="text-center">
          <div className="font-medium text-lg">{rating}</div>
          <Rate 
            disabled 
            defaultValue={rating} 
            style={{ fontSize: '12px' }}
          />
          <div className="text-xs text-gray-500 mt-1">
            <Tag color={getRatingColor(rating)}>
              {rating >= 4 ? 'Tốt' : rating >= 3 ? 'Khá' : 'Kém'}
            </Tag>
          </div>
        </div>
      ),
      sorter: (a, b) => a.rating - b.rating
    },
    {
      title: 'Nội dung review',
      render: (_, record: ProductReview) => (
        <div className="max-w-xs">
          <div className="font-medium mb-1">{record.title}</div>
          <div className="text-sm text-gray-600 line-clamp-2">
            {record.content}
          </div>
          {record.images.length > 0 && (
            <div className="mt-2">
              <Badge count={record.images.length} color="blue">
                <Button size="small" icon={<PictureOutlined />} type="text">
                  Hình ảnh
                </Button>
              </Badge>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
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
      title: 'Tương tác',
      render: (_, record: ProductReview) => (
        <div className="text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <LikeOutlined className="text-green-500" />
              <span className="font-medium">{record.likes}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <DislikeOutlined className="text-red-500" />
              <span className="font-medium">{record.dislikes}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <BulbOutlined className="text-blue-500" />
              <span className="font-medium">{record.helpfulCount}</span>
            </div>
          </div>
          {record.reportCount > 0 && (
            <div className="mt-2">
              <Badge count={record.reportCount} color="red">
                <FlagOutlined className="text-red-500" />
              </Badge>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProductReview['status']) => (
        <Tag 
          color={getStatusColor(status)}
          icon={getStatusIcon(status)}
        >
          {getStatusLabel(status)}
        </Tag>
      )
    },
    {
      title: 'Quản lý',
      key: 'actions',
      width: 200,
      render: (_, record: ProductReview) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => handleViewReview(record)}
            />
          </Tooltip>
          <Tooltip title="Duyệt/Ẩn">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleModerateReview(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="Approve">
              <Button 
                type="text" 
                icon={<CheckOutlined />}
                onClick={() => handleUpdateStatus(record.id, 'active')}
                className="text-green-500"
              />
            </Tooltip>
          )}
          {record.status !== 'hidden' && (
            <Tooltip title="Ẩn">
              <Button 
                type="text" 
                icon={<StopOutlined />}
                onClick={() => handleUpdateStatus(record.id, 'hidden')}
                className="text-orange-500"
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Bạn có chắc muốn xóa review này?"
            onConfirm={() => handleDeleteReview(record.id)}
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const activeReviews = reviews.filter(r => r.status === 'active').length;
  const pendingReviews = reviews.filter(r => r.status === 'pending').length;
  const reportedReviews = reviews.filter(r => r.status === 'reported').length;
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

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
              <h2 className="text-2xl font-bold text-gray-800">Review Management</h2>
              <p className="text-gray-600">Quản lý đánh giá sản phẩm và nội dung cộng đồng</p>
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchReviews(reviewFilter)}
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

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <Search
              placeholder="Tìm kiếm review, user, sản phẩm..."
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
              <Option value="active">Hiển thị</Option>
              <Option value="hidden">Ẩn</Option>
              <Option value="reported">Báo cáo</Option>
              <Option value="pending">Chờ duyệt</Option>
            </Select>

            <Select
              placeholder="Điểm rating"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => handleFilterChange('rating', value)}
            >
              <Option value={5}>5 sao</Option>
              <Option value={4}>4 sao</Option>
              <Option value={3}>3 sao</Option>
              <Option value={2}>2 sao</Option>
              <Option value={1}>1 sao</Option>
            </Select>

            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
            />
          </div>

          {/* Bulk Actions */}
          {selectedRowKeys.length > 0 && (
            <div className="mb-4">
              <Space>
                <span>Đã chọn {selectedRowKeys.length} review:</span>
                <Button 
                  type="primary" 
                  size="small"
                  onClick={() => handleBulkAction('active')}
                >
                  Approve
                </Button>
                <Button 
                  size="small"
                  onClick={() => handleBulkAction('hidden')}
                >
                  Ẩn
                </Button>
                <Button 
                  danger 
                  size="small"
                  onClick={() => handleBulkAction('reported')}
                >
                  Báo cáo
                </Button>
              </Space>
            </div>
          )}

          {/* Stats */}
          <Row gutter={16} className="mb-6">
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Tổng review"
                  value={reviews.length}
                  prefix={<MessageOutlined className="text-blue-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Đang hiển thị"
                  value={activeReviews}
                  prefix={<CheckOutlined className="text-green-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Chờ duyệt"
                  value={pendingReviews}
                  prefix={<ClockCircleOutlined className="text-orange-500" />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" className="text-center">
                <Statistic
                  title="Điểm TB"
                  value={averageRating.toFixed(1)}
                  prefix={<StarOutlined className="text-yellow-500" />}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <Table
          columns={columns}
          dataSource={reviews}
          rowKey="id"
          rowSelection={rowSelection}
          loading={loading}
          pagination={{
            current: 1,
            pageSize: 10,
            total: reviews.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} review`
          }}
        />
      </Card>

      {/* Review Detail Drawer */}
      <Drawer
        title="Chi tiết review"
        width={600}
        open={reviewDetailVisible}
        onClose={() => setReviewDetailVisible(false)}
      >
        {selectedReview && (
          <div className="space-y-6">
            {/* User & Product Info */}
            <div className="grid grid-cols-2 gap-4">
              <Card size="small" title="Người đánh giá">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    size={50} 
                    src={selectedReview.userAvatar} 
                    className="bg-blue-500"
                  >
                    {selectedReview.username.charAt(0)}
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedReview.username}</div>
                    <div className="text-sm text-gray-500">ID: {selectedReview.userId}</div>
                  </div>
                </div>
              </Card>
              
              <Card size="small" title="Sản phẩm">
                <div className="flex items-center space-x-3">
                  <Image
                    width={50}
                    height={50}
                    src={selectedReview.productImage}
                    alt={selectedReview.productName}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-medium">{selectedReview.productName}</div>
                    <div className="text-sm text-gray-500">ID: {selectedReview.productId}</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Rating & Title */}
            <Card size="small" title="Đánh giá">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold mb-2">{selectedReview.rating}/5</div>
                <Rate disabled defaultValue={selectedReview.rating} />
              </div>
              <div className="text-lg font-medium text-center">
                {selectedReview.title}
              </div>
            </Card>

            {/* Content */}
            <Card size="small" title="Nội dung">
              <div className="text-gray-700 whitespace-pre-wrap">
                {selectedReview.content}
              </div>
            </Card>

            {/* Images */}
            {selectedReview.images.length > 0 && (
              <Card size="small" title="Hình ảnh">
                <div className="grid grid-cols-2 gap-2">
                  {selectedReview.images.map((image, index) => (
                    <Image
                      key={index}
                      width="100%"
                      height={150}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              </Card>
            )}

            {/* Interactions */}
            <Card size="small" title="Tương tác">
              <Row gutter={16}>
                <Col span={6}>
                  <Statistic
                    title="Likes"
                    value={selectedReview.likes}
                    prefix={<LikeOutlined className="text-green-500" />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Dislikes"
                    value={selectedReview.dislikes}
                    prefix={<DislikeOutlined className="text-red-500" />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Helpful"
                    value={selectedReview.helpfulCount}
                    prefix={<BulbOutlined className="text-blue-500" />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Reports"
                    value={selectedReview.reportCount}
                    prefix={<FlagOutlined className="text-red-500" />}
                  />
                </Col>
              </Row>
            </Card>

            {/* Status & Admin Notes */}
            <Card size="small" title="Trạng thái & Ghi chú">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span>Trạng thái:</span>
                  <Tag 
                    color={getStatusColor(selectedReview.status)}
                    icon={getStatusIcon(selectedReview.status)}
                  >
                    {getStatusLabel(selectedReview.status)}
                  </Tag>
                </div>
              </div>
              
              {selectedReview.adminNotes && (
                <div>
                  <div className="font-medium mb-2">Ghi chú admin:</div>
                  <div className="text-gray-600 bg-gray-50 p-3 rounded">
                    {selectedReview.adminNotes}
                  </div>
                </div>
              )}
              
              {selectedReview.moderatedBy && (
                <div className="mt-4 text-sm text-gray-500">
                  Được duyệt bởi: {selectedReview.moderatedBy} • {new Date(selectedReview.moderatedAt!).toLocaleString('vi-VN')}
                </div>
              )}
            </Card>

            {/* Actions */}
            <Card size="small" title="Hành động">
              <Space wrap>
                <Button 
                  type="primary" 
                  icon={<CheckOutlined />}
                  onClick={() => {
                    handleUpdateStatus(selectedReview.id, 'active');
                    setReviewDetailVisible(false);
                  }}
                >
                  Approve
                </Button>
                <Button 
                  icon={<StopOutlined />}
                  onClick={() => {
                    handleUpdateStatus(selectedReview.id, 'hidden');
                    setReviewDetailVisible(false);
                  }}
                >
                  Ẩn
                </Button>
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    handleDeleteReview(selectedReview.id);
                    setReviewDetailVisible(false);
                  }}
                >
                  Xóa
                </Button>
              </Space>
            </Card>
          </div>
        )}
      </Drawer>

      {/* Moderation Modal */}
      <Modal
        title="Duyệt review"
        open={moderationModalVisible}
        onCancel={() => {
          setModerationModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModeration}
          initialValues={{
            status: selectedReview?.status
          }}
        >
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="active">Hiển thị</Option>
              <Option value="hidden">Ẩn</Option>
              <Option value="reported">Báo cáo</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            label="Ghi chú admin"
            name="notes"
          >
            <Input.TextArea
              rows={4}
              placeholder="Nhập ghi chú cho quyết định này..."
              maxLength={500}
              showCount
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật
              </Button>
              <Button onClick={() => {
                setModerationModalVisible(false);
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

export default ReviewManagement; 