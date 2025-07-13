import React from 'react';
import { Row, Col, Card, Statistic, Button } from 'antd';
import { CalendarOutlined, FireOutlined, TrophyOutlined, GiftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import StreakCalendar from '../components/StreakCalendar';
import StreakProgress from '../components/StreakProgress';
import CheckInButton from '../components/CheckInButton';
import DailyCheckinModal from '../components/streak/DailyCheckinModal';
import { useAppStore } from '../stores/appStore';

const CheckinPage: React.FC = () => {
  const { dailyCheckin, setShowCheckinModal, showCheckinModal } = useAppStore();

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

  const availableRewards = dailyCheckin.rewards.filter(r => !r.claimed && dailyCheckin.currentStreak >= r.day);
  const nextReward = dailyCheckin.rewards.find(r => !r.claimed && dailyCheckin.currentStreak < r.day);

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
            Daily Check-in 📅
          </h1>
          <p className="text-lg text-gray-600">
            Điểm danh mỗi ngày để duy trì streak và nhận thưởng hấp dẫn
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="mb-8">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Current Streak"
                value={dailyCheckin.currentStreak}
                prefix={<FireOutlined />}
                suffix="days"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Check-ins"
                value={dailyCheckin.totalCheckins}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Rewards Earned"
                value={dailyCheckin.rewards.filter(r => r.claimed).length}
                prefix={<TrophyOutlined />}
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
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Available Rewards Banner */}
      {availableRewards.length > 0 && (
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-green-800 mb-2 flex items-center">
                  <GiftOutlined className="mr-2" />
                  🎉 Bạn có {availableRewards.length} phần thưởng chờ nhận!
                </h3>
                {availableRewards.map((reward, index) => (
                  <p key={reward.day} className="text-green-700 mb-1">
                    • <strong>{reward.title}</strong>: {reward.description}
                  </p>
                ))}
              </div>
              <Button
                type="primary"
                size="large"
                onClick={() => setShowCheckinModal(true)}
                className="bg-green-500 border-green-500"
              >
                Nhận thưởng ngay
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Next Reward Info */}
      {nextReward && (
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="text-center">
              <h3 className="text-lg font-bold text-yellow-800 mb-2">
                🎯 Phần thưởng tiếp theo
              </h3>
              <p className="text-yellow-700 mb-2">
                <strong>{nextReward.title}</strong>: {nextReward.description}
              </p>
              <p className="text-yellow-600">
                Còn <strong>{nextReward.day - dailyCheckin.currentStreak}</strong> ngày nữa để nhận thưởng này!
              </p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Main Content */}
      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} lg={14}>
          <div className="space-y-6">
            {/* Check-in Section */}
            <motion.div variants={itemVariants}>
              <Card className="text-center bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                <div className="py-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Daily Check-in
                  </h2>
                  <CheckInButton />
                  <div className="mt-4">
                    <Button
                      type="link"
                      onClick={() => setShowCheckinModal(true)}
                      className="text-blue-600"
                    >
                      Xem chi tiết streak và phần thưởng
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Calendar */}
            <motion.div variants={itemVariants}>
              <StreakCalendar type="daily" />
            </motion.div>
          </div>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={10}>
          <motion.div variants={itemVariants}>
            <StreakProgress />
          </motion.div>
        </Col>
      </Row>

      {/* Rewards History */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card title="🏆 Lịch sử phần thưởng">
          <div className="space-y-3">
            {dailyCheckin.rewards.map((reward) => (
              <div
                key={reward.day}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  reward.claimed
                    ? 'bg-green-50 border-green-200'
                    : dailyCheckin.currentStreak >= reward.day
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {reward.claimed ? '🏆' : dailyCheckin.currentStreak >= reward.day ? '🎁' : '🔒'}
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
                  ) : dailyCheckin.currentStreak >= reward.day ? (
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => setShowCheckinModal(true)}
                      className="bg-green-500 border-green-500"
                    >
                      Nhận ngay
                    </Button>
                  ) : (
                    <span className="text-gray-400">
                      Còn {reward.day - dailyCheckin.currentStreak} ngày
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Tips Section */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card 
          title="💡 Tips để duy trì streak"
          className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">⏰ Đặt nhắc nhở</h4>
              <p className="text-sm text-gray-600">
                Đặt alarm hoặc notification để nhớ điểm danh mỗi ngày vào cùng một thời điểm.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🎯 Tạo thói quen</h4>
              <p className="text-sm text-gray-600">
                Kết hợp việc điểm danh với hoạt động hàng ngày như uống cà phê buổi sáng.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🏆 Theo dõi tiến độ</h4>
              <p className="text-sm text-gray-600">
                Thường xuyên kiểm tra calendar và progress để duy trì động lực.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🎁 Tận hưởng thưởng</h4>
              <p className="text-sm text-gray-600">
                Nhận thưởng ngay khi đủ điều kiện để tăng cảm giác thành tựu.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Daily Checkin Modal */}
      <DailyCheckinModal
        visible={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
      />
    </motion.div>
  );
};

export default CheckinPage;