import React from 'react';
import { Alert, Progress, Button } from 'antd';
import { FireOutlined, GiftOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';
import dayjs from 'dayjs';

const StreakBanner: React.FC = () => {
  const { dailyCheckin, shoppingStreak, weeklyStreak, setShowCheckinModal } = useAppStore();
  
  const today = dayjs().format('YYYY-MM-DD');
  const hasCheckedInToday = dailyCheckin.lastCheckin === today;
  const hasOrderedToday = shoppingStreak.lastOrder === today;

  // Check if user is about to lose streak
  const aboutToLoseDaily = !hasCheckedInToday && dailyCheckin.currentStreak > 0;
  const aboutToLoseShopping = !hasOrderedToday && shoppingStreak.currentStreak > 0;

  // Check for available rewards
  const availableCheckinReward = dailyCheckin.rewards.find(r => !r.claimed && dailyCheckin.currentStreak >= r.day);
  const availableShoppingReward = shoppingStreak.rewards.find(r => !r.claimed && shoppingStreak.currentStreak >= r.day);
  const weeklyComplete = weeklyStreak.purchasesThisWeek >= weeklyStreak.targetPurchases;

  if (aboutToLoseDaily || aboutToLoseShopping) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Alert
          message="⚠️ Cảnh báo: Streak sắp bị mất!"
          description={
            <div className="flex items-center justify-between">
              <div>
                {aboutToLoseDaily && (
                  <p className="mb-1">
                    • Bạn chưa điểm danh hôm nay. Streak hiện tại: <strong>{dailyCheckin.currentStreak} ngày</strong>
                  </p>
                )}
                {aboutToLoseShopping && (
                  <p className="mb-1">
                    • Bạn chưa mua hàng hôm nay. Shopping streak: <strong>{shoppingStreak.currentStreak} ngày</strong>
                  </p>
                )}
                <p className="text-sm">Hành động ngay để giữ streak và nhận thưởng!</p>
              </div>
              {aboutToLoseDaily && (
                <Button
                  type="primary"
                  danger
                  onClick={() => setShowCheckinModal(true)}
                  className="ml-4"
                >
                  Điểm danh ngay
                </Button>
              )}
            </div>
          }
          type="warning"
          showIcon
          className="border-orange-300 bg-orange-50"
        />
      </motion.div>
    );
  }

  if (availableCheckinReward || availableShoppingReward || weeklyComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Alert
          message="🎁 Bạn có phần thưởng chờ nhận!"
          description={
            <div>
              {availableCheckinReward && (
                <p className="mb-1">
                  • <strong>{availableCheckinReward.title}</strong>: {availableCheckinReward.description}
                </p>
              )}
              {availableShoppingReward && (
                <p className="mb-1">
                  • <strong>{availableShoppingReward.title}</strong>: {availableShoppingReward.description}
                </p>
              )}
              {weeklyComplete && (
                <p className="mb-1">
                  • <strong>Weekly Challenge Complete!</strong> Bạn đã hoàn thành mục tiêu tuần này
                </p>
              )}
            </div>
          }
          type="success"
          showIcon
          className="border-green-300 bg-green-50"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FireOutlined className="text-orange-500 mr-2" />
            Điểm danh mỗi ngày - Nhận quà liên tiếp!
          </h3>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => setShowCheckinModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-none"
          >
            Xem chi tiết
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Daily Checkin */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FireOutlined className="text-orange-500" />
              <span className="font-semibold">Daily Check-in</span>
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {dailyCheckin.currentStreak} ngày
            </div>
            <div className="text-sm text-gray-600">
              {hasCheckedInToday ? '✅ Đã điểm danh hôm nay' : '⏰ Chưa điểm danh'}
            </div>
          </div>

          {/* Shopping Streak */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <GiftOutlined className="text-purple-500" />
              <span className="font-semibold">Shopping Streak</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {shoppingStreak.currentStreak} ngày
            </div>
            <div className="text-sm text-gray-600">
              {hasOrderedToday ? '✅ Đã mua hàng hôm nay' : '🛍️ Mua hàng để tăng streak'}
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarOutlined className="text-green-500" />
              <span className="font-semibold">Weekly Goal</span>
            </div>
            <div className="mb-2">
              <Progress
                percent={(weeklyStreak.purchasesThisWeek / weeklyStreak.targetPurchases) * 100}
                strokeColor="#52c41a"
                size="small"
              />
            </div>
            <div className="text-sm text-gray-600">
              {weeklyStreak.purchasesThisWeek}/{weeklyStreak.targetPurchases} đơn hàng tuần này
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StreakBanner;