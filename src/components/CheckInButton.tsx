import React, { useState } from 'react';
import { Button, message } from 'antd';
import { CheckOutlined, FireOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useStreakStore } from '../stores/streakStore';
import dayjs from 'dayjs';

const CheckInButton: React.FC = () => {
  const { streakData, checkIn } = useStreakStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const today = dayjs().format('YYYY-MM-DD');
  const hasCheckedInToday = streakData.lastCheckIn === today;

  const handleCheckIn = async () => {
    if (hasCheckedInToday) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      checkIn();
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      message.success('🎉 Check-in successful! Streak maintained!');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="text-center">
      <motion.div
        whileHover={{ scale: hasCheckedInToday ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          type="primary"
          size="large"
          loading={isLoading}
          disabled={hasCheckedInToday}
          onClick={handleCheckIn}
          className={`h-16 px-8 text-lg font-semibold rounded-xl ${
            hasCheckedInToday
              ? 'bg-green-500 border-green-500'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 border-none'
          }`}
          icon={hasCheckedInToday ? <CheckOutlined /> : <FireOutlined />}
        >
          {hasCheckedInToday ? 'Checked In Today!' : 'Check In Now'}
        </Button>
      </motion.div>
      
      <div className="mt-3 text-sm text-gray-600">
        {hasCheckedInToday ? (
          <span className="text-green-600 font-medium">
            ✅ You've maintained your {streakData.currentStreak}-day streak!
          </span>
        ) : (
          <span>
            Check in daily to maintain your streak and earn rewards
          </span>
        )}
      </div>
    </div>
  );
};

export default CheckInButton;