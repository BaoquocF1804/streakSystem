import React from 'react';
import { Row, Col, Card, Statistic, Button, List, Tag, Progress } from 'antd';
import { ShoppingOutlined, FireOutlined, CalendarOutlined, GiftOutlined, TrophyOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import StreakCalendar from '../components/StreakCalendar';
import ShoppingStreakPanel from '../components/ShoppingStreakPanel';
import { useAppStore } from '../stores/appStore';
import dayjs from 'dayjs';

const ShoppingStreakPage: React.FC = () => {
  const { shoppingStreak, orders, claimShoppingReward } = useAppStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.price, 0);
  const availableRewards = shoppingStreak.rewards.filter(r => !r.claimed && shoppingStreak.currentStreak >= r.day);
  const nextReward = shoppingStreak.rewards.find(r => !r.claimed && shoppingStreak.currentStreak < r.day);

  const handleClaimReward = (day: number) => {
    claimShoppingReward(day);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Shopping Streak 🛍️
          </h1>
          <p className="text-lg text-gray-600">
            Mua hàng liên tục để duy trì streak và nhận ưu đãi đặc biệt
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="mb-8">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Shopping Streak"
                value={shoppingStreak.currentStreak}
                prefix={<FireOutlined />}
                suffix="days"
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={shoppingStreak.totalOrders}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Spent"
                value={totalSpent}
                formatter={(value) => formatCurrency(Number(value))}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Available Rewards"
                value={availableRewards.length}
                prefix={<GiftOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Available Rewards Banner */}
      {availableRewards.length > 0 && (
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-purple-800 mb-2 flex items-center">
                  <GiftOutlined className="mr-2" />
                  🎉 Bạn có {availableRewards.length} phần thưởng shopping chờ nhận!
                </h3>
                {availableRewards.map((reward) => (
                  <p key={reward.day} className="text-purple-700 mb-1">
                    • <strong>{reward.title}</strong>: {reward.description}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                {availableRewards.map((reward) => (
                  <Button
                    key={reward.day}
                    type="primary"
                    onClick={() => handleClaimReward(reward.day)}
                    className="bg-purple-500 border-purple-500 block"
                  >
                    Nhận thưởng {reward.day} ngày
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Next Reward Info */}
      {nextReward && (
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-yellow-800 mb-2">
                  🎯 Phần thưởng tiếp theo
                </h3>
                <p className="text-yellow-700 mb-2">
                  <strong>{nextReward.title}</strong>: {nextReward.description}
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {nextReward.day - shoppingStreak.currentStreak}
                </div>
                <div className="text-sm text-yellow-600">ngày nữa</div>
                <Progress
                  type="circle"
                  size={80}
                  percent={(shoppingStreak.currentStreak / nextReward.day) * 100}
                  strokeColor="#faad14"
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Left Column - Calendar */}
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <StreakCalendar type="shopping" />
          </motion.div>
        </Col>

        {/* Right Column - Shopping Panel */}
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <ShoppingStreakPanel />
          </motion.div>
        </Col>
      </Row>

      {/* Order History */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card
          title={
            <div className="flex items-center">
              <CalendarOutlined className="mr-2" />
              Lịch sử đơn hàng
            </div>
          }
        >
          <List
            dataSource={orders}
            renderItem={(order, index) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <List.Item
                  actions={[
                    order.contributeToStreak ? (
                      <Tag color="success" icon={<FireOutlined />}>
                        Streak +1
                      </Tag>
                    ) : (
                      <Tag color="default">No Streak</Tag>
                    )
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div className="flex items-center justify-between">
                        <span>{order.productName}</span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(order.price)}
                        </span>
                      </div>
                    }
                    description={
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500">
                          <CalendarOutlined className="mr-1" />
                          {dayjs(order.date).format('DD/MM/YYYY')}
                        </div>
                        <Tag color={order.status === 'completed' ? 'success' : 'processing'}>
                          {order.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                        </Tag>
                      </div>
                    }
                  />
                </List.Item>
              </motion.div>
            )}
          />
          
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ShoppingOutlined className="text-4xl mb-2 opacity-50" />
              <div>Chưa có đơn hàng nào</div>
              <div className="text-sm">Bắt đầu mua sắm để tạo shopping streak!</div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Rewards History */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card title="🏆 Lịch sử phần thưởng shopping">
          <div className="space-y-3">
            {shoppingStreak.rewards.map((reward) => (
              <div
                key={reward.day}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  reward.claimed
                    ? 'bg-green-50 border-green-200'
                    : shoppingStreak.currentStreak >= reward.day
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {reward.claimed ? '🏆' : shoppingStreak.currentStreak >= reward.day ? '🎁' : '🔒'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {reward.day} ngày - {reward.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {reward.description}
                    </div>
                    {reward.claimed && reward.claimedDate && (
                      <div className="text-xs text-green-600">
                        Đã nhận: {reward.claimedDate}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {reward.claimed ? (
                    <span className="text-green-600 font-medium">✅ Đã nhận</span>
                  ) : shoppingStreak.currentStreak >= reward.day ? (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleClaimReward(reward.day)}
                      className="bg-purple-500 border-purple-500"
                    >
                      Nhận ngay
                    </Button>
                  ) : (
                    <span className="text-gray-400">
                      Còn {reward.day - shoppingStreak.currentStreak} ngày
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Shopping Tips */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card 
          title="💡 Tips để duy trì shopping streak"
          className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🛒 Mua sắm thông minh</h4>
              <p className="text-sm text-gray-600">
                Lên kế hoạch mua sắm trước để duy trì streak một cách tự nhiên và tiết kiệm.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">💰 Tận dụng ưu đãi</h4>
              <p className="text-sm text-gray-600">
                Kết hợp streak với các chương trình khuyến mãi để tối ưu hóa lợi ích.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">📱 Theo dõi thường xuyên</h4>
              <p className="text-sm text-gray-600">
                Kiểm tra streak hàng ngày để không bỏ lỡ cơ hội nhận thưởng.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🎁 Nhận thưởng kịp thời</h4>
              <p className="text-sm text-gray-600">
                Claim rewards ngay khi đủ điều kiện để không bỏ lỡ ưu đãi.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ShoppingStreakPage;