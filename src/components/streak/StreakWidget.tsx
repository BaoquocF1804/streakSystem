import React from 'react';
import { Badge, Tooltip } from 'antd';
import { FireOutlined, ShoppingOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';

const StreakWidget: React.FC = () => {
  const { dailyCheckin, shoppingStreak, weeklyStreak } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center space-x-4"
    >
      {/* Daily Checkin Streak */}
      <Tooltip title={`Điểm danh liên tiếp ${dailyCheckin.currentStreak} ngày`}>
        <Badge count={dailyCheckin.currentStreak} showZero>
          <div className="flex items-center space-x-1 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
            <FireOutlined className="text-orange-500" />
            <span className="text-sm font-medium text-orange-700 hidden sm:inline">
              Check-in
            </span>
          </div>
        </Badge>
      </Tooltip>

      {/* Shopping Streak */}
      <Tooltip title={`Mua hàng liên tiếp ${shoppingStreak.currentStreak} ngày`}>
        <Badge count={shoppingStreak.currentStreak} showZero>
          <div className="flex items-center space-x-1 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
            <ShoppingOutlined className="text-purple-500" />
            <span className="text-sm font-medium text-purple-700 hidden sm:inline">
              Shopping
            </span>
          </div>
        </Badge>
      </Tooltip>

      {/* Weekly Progress */}
      <Tooltip title={`Tiến độ tuần: ${weeklyStreak.purchasesThisWeek}/${weeklyStreak.targetPurchases}`}>
        <div className="flex items-center space-x-1 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
          <CalendarOutlined className="text-green-500" />
          <span className="text-sm font-medium text-green-700">
            {weeklyStreak.purchasesThisWeek}/{weeklyStreak.targetPurchases}
          </span>
          {weeklyStreak.badge && (
            <span className="text-xs">🏆</span>
          )}
        </div>
      </Tooltip>
    </motion.div>
  );
};

export default StreakWidget;