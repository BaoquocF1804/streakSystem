import React from 'react';
import { Progress, Card, Button, Tag } from 'antd';
import { TrophyOutlined, CalendarOutlined, GiftOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useStreakStore } from '../stores/streakStore';

const WeeklyStreakPanel: React.FC = () => {
  const { weeklyChallenges, updateWeeklyProgress } = useStreakStore();

  const handleClaimReward = (challengeId: string) => {
    // Simulate claiming reward
    console.log('Claiming reward for challenge:', challengeId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <CalendarOutlined className="mr-2 text-blue-500" />
          Weekly Challenges
        </h3>
        <Tag color="blue" icon={<TrophyOutlined />}>
          {weeklyChallenges.filter(c => c.completed).length} / {weeklyChallenges.length} Completed
        </Tag>
      </div>

      <div className="grid gap-4">
        {weeklyChallenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`border transition-all ${
                challenge.completed
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {challenge.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {challenge.description}
                  </p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{challenge.progress} / {challenge.target}</span>
                    </div>
                    <Progress
                      percent={(challenge.progress / challenge.target) * 100}
                      strokeColor={challenge.completed ? '#52c41a' : '#1890ff'}
                      className="mb-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-600">Reward: </span>
                      <span className="font-medium text-purple-600">
                        {challenge.reward}
                      </span>
                    </div>
                    
                    {challenge.completed && (
                      <Button
                        type="primary"
                        size="small"
                        icon={<GiftOutlined />}
                        onClick={() => handleClaimReward(challenge.id)}
                        className="bg-green-500 border-green-500"
                      >
                        Claim Reward
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="ml-4">
                  {challenge.completed ? (
                    <div className="text-3xl">🏆</div>
                  ) : (
                    <div className="text-3xl opacity-50">⏳</div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyStreakPanel;