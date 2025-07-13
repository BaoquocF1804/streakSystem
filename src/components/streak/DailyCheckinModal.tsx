import React, { useState } from 'react';
import { Modal, Button, Progress, Calendar, message } from 'antd';
import { FireOutlined, GiftOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import confetti from 'react-confetti';
import dayjs, { Dayjs } from 'dayjs';
import { useAppStore } from '../../stores/appStore';

interface DailyCheckinModalProps {
  visible: boolean;
  onClose: () => void;
}

const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({ visible, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);
  const { dailyCheckin, checkinToday, claimCheckinReward } = useAppStore();

  const today = dayjs().format('YYYY-MM-DD');
  const hasCheckedInToday = dailyCheckin.lastCheckin === today;

  const handleCheckin = async () => {
    if (hasCheckedInToday) return;
    
    setLoading(true);
    
    setTimeout(() => {
      checkinToday();
      setShowConfetti(true);
      message.success('🎉 Điểm danh thành công! Streak được duy trì!');
      setLoading(false);
      
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    }, 1000);
  };

  const handleClaimReward = (day: number) => {
    claimCheckinReward(day);
    message.success('🎁 Nhận thưởng thành công!');
  };

  const getDateStatus = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    const daysDiff = dayjs().diff(date, 'day');
    return daysDiff >= 0 && daysDiff < dailyCheckin.currentStreak;
  };

  const dateCellRender = (date: Dayjs) => {
    const hasActivity = getDateStatus(date);
    const isToday = date.format('YYYY-MM-DD') === today;
    
    if (hasActivity) {
      return (
        <div className="flex justify-center">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          {isToday && <FireOutlined className="text-orange-500 ml-1" />}
        </div>
      );
    }
    
    return null;
  };

  const nextReward = dailyCheckin.rewards.find(r => !r.claimed && dailyCheckin.currentStreak >= r.day);
  const upcomingReward = dailyCheckin.rewards.find(r => !r.claimed && dailyCheckin.currentStreak < r.day);

  return (
    <>
      {showConfetti && (
        <confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <CalendarOutlined className="text-blue-500" />
            <span>Điểm danh hàng ngày</span>
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={600}
        className="daily-checkin-modal"
      >
        <div className="space-y-6">
          {/* Current Streak Display */}
          <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {dailyCheckin.currentStreak}
              </div>
              <div className="text-lg text-gray-700 mb-4">
                Ngày điểm danh liên tiếp
              </div>
              {!hasCheckedInToday ? (
                <p className="text-gray-600 mb-4">
                  Điểm danh hôm nay để duy trì streak và nhận thưởng!
                </p>
              ) : (
                <p className="text-green-600 font-medium mb-4">
                  ✅ Bạn đã điểm danh hôm nay!
                </p>
              )}
            </motion.div>
          </div>

          {/* Mini Calendar */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <FireOutlined className="text-orange-500 mr-2" />
              Lịch điểm danh
            </h4>
            <Calendar
              fullscreen={false}
              dateCellRender={dateCellRender}
              className="streak-calendar"
            />
          </div>

          {/* Rewards Progress */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-semibold mb-4 flex items-center">
              <GiftOutlined className="text-purple-500 mr-2" />
              Phần thưởng
            </h4>
            
            {upcomingReward && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Tiến độ đến phần thưởng tiếp theo</span>
                  <span>{dailyCheckin.currentStreak}/{upcomingReward.day}</span>
                </div>
                <Progress
                  percent={(dailyCheckin.currentStreak / upcomingReward.day) * 100}
                  strokeColor="#1890ff"
                />
                <p className="text-sm text-gray-600 mt-2">
                  <strong>{upcomingReward.title}</strong>: {upcomingReward.description}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {dailyCheckin.rewards.map((reward) => (
                <div
                  key={reward.day}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    reward.claimed
                      ? 'bg-green-50 border-green-200'
                      : dailyCheckin.currentStreak >= reward.day
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div>
                    <div className="font-medium">{reward.day} ngày - {reward.title}</div>
                    <div className="text-sm text-gray-600">{reward.description}</div>
                  </div>
                  <div>
                    {reward.claimed ? (
                      <span className="text-green-600 text-sm">✅ Đã nhận</span>
                    ) : dailyCheckin.currentStreak >= reward.day ? (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleClaimReward(reward.day)}
                        className="bg-green-500 border-green-500"
                      >
                        Nhận thưởng
                      </Button>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Còn {reward.day - dailyCheckin.currentStreak} ngày
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Check-in Button */}
          <div className="text-center">
            <Button
              type="primary"
              size="large"
              loading={loading}
              disabled={hasCheckedInToday}
              onClick={handleCheckin}
              className={`h-12 px-8 rounded-lg ${
                hasCheckedInToday
                  ? 'bg-green-500 border-green-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 border-none'
              }`}
              icon={hasCheckedInToday ? <span>✅</span> : <FireOutlined />}
            >
              {hasCheckedInToday ? 'Đã điểm danh hôm nay!' : 'Điểm danh ngay'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DailyCheckinModal;