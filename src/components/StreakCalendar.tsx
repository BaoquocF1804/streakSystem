import React from 'react';
import { Calendar, Badge } from 'antd';
import { CheckCircleOutlined, FireOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { useStreakStore } from '../stores/streakStore';

interface StreakCalendarProps {
  type?: 'daily' | 'shopping';
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({ type = 'daily' }) => {
  const { streakData, shoppingOrders } = useStreakStore();

  const getDateStatus = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    const today = dayjs().format('YYYY-MM-DD');
    
    if (type === 'shopping') {
      const hasOrder = shoppingOrders.some(order => order.date === dateStr && order.contributeToStreak);
      return hasOrder;
    }
    
    // For daily check-in
    const daysDiff = dayjs().diff(date, 'day');
    return daysDiff >= 0 && daysDiff < streakData.currentStreak;
  };

  const cellRender = (date: Dayjs) => {
    const hasActivity = getDateStatus(date);
    const isToday = date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
    
    if (hasActivity) {
      return (
        <div className="flex justify-center">
          <Badge
            status="success"
            className="streak-badge"
          />
          {isToday && <FireOutlined className="text-orange-500 ml-1" />}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        {type === 'shopping' ? '🛍️' : '📅'} 
        {type === 'shopping' ? 'Shopping Streak Calendar' : 'Daily Check-in Calendar'}
      </h3>
      <Calendar
        fullscreen={false}
        cellRender={cellRender}
        className="streak-calendar"
      />
      <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Badge status="success" />
            <span className="ml-1">Active Day</span>
          </div>
          <div className="flex items-center">
            <FireOutlined className="text-orange-500" />
            <span className="ml-1">Today</span>
          </div>
        </div>
        <div className="font-medium">
          Current Streak: <span className="text-blue-600">{streakData.currentStreak} days</span>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;