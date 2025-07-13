import React from 'react';
import { Progress, Tag, Tooltip } from 'antd';
import { TrophyOutlined, GiftOutlined, FireOutlined } from '@ant-design/icons';
import { useStreakStore } from '../stores/streakStore';

const StreakProgress: React.FC = () => {
  const { streakData } = useStreakStore();
  
  const milestones = [
    { days: 3, reward: 'Bronze Badge', icon: '🥉', unlocked: streakData.currentStreak >= 3 },
    { days: 7, reward: 'Silver Badge + Mentor Session', icon: '🥈', unlocked: streakData.currentStreak >= 7 },
    { days: 14, reward: 'Gold Badge + Priority Demo', icon: '🥇', unlocked: streakData.currentStreak >= 14 },
    { days: 30, reward: 'Diamond Badge + Special Access', icon: '💎', unlocked: streakData.currentStreak >= 30 },
  ];

  const getProgressPercent = () => {
    const nextMilestone = milestones.find(m => !m.unlocked);
    if (!nextMilestone) return 100;
    return (streakData.currentStreak / nextMilestone.days) * 100;
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <FireOutlined className="text-orange-500 mr-2" />
          Streak Progress
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{streakData.currentStreak}</div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress to next reward</span>
          <span>{Math.min(getProgressPercent(), 100).toFixed(0)}%</span>
        </div>
        <Progress
          percent={getProgressPercent()}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          className="mb-2"
        />
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-gray-700 flex items-center">
          <TrophyOutlined className="mr-2" />
          Milestone Rewards
        </h4>
        {milestones.map((milestone) => (
          <div
            key={milestone.days}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              milestone.unlocked
                ? 'bg-green-50 border-green-200'
                : streakData.currentStreak >= milestone.days - 2
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{milestone.icon}</span>
              <div>
                <div className="font-medium text-gray-800">{milestone.days} Days</div>
                <div className="text-sm text-gray-600">{milestone.reward}</div>
              </div>
            </div>
            <div>
              {milestone.unlocked ? (
                <Tag color="success" icon={<GiftOutlined />}>
                  Unlocked
                </Tag>
              ) : (
                <Tag color="default">
                  {milestone.days - streakData.currentStreak} days left
                </Tag>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-purple-600">{streakData.longestStreak}</div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{streakData.totalCheckIns}</div>
            <div className="text-sm text-gray-600">Total Check-ins</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakProgress;