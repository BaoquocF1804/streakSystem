import React from 'react';
import { Row, Col, Card, Progress, Statistic } from 'antd';
import { CalendarOutlined, TrophyOutlined, FireOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import WeeklyStreakPanel from '../components/WeeklyStreakPanel';
import { useStreakStore } from '../stores/streakStore';

const WeeklyPage: React.FC = () => {
  const { streakData, weeklyChallenges } = useStreakStore();

  const completedChallenges = weeklyChallenges.filter(c => c.completed).length;
  const weeklyProgress = (completedChallenges / weeklyChallenges.length) * 100;

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
            Weekly Challenges 📊
          </h1>
          <p className="text-lg text-gray-600">
            Complete weekly goals to earn special rewards and badges
          </p>
        </div>
      </motion.div>

      {/* Weekly Overview */}
      <motion.div variants={itemVariants} className="mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Statistic
                title="Weekly Progress"
                value={weeklyProgress}
                suffix="%"
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress
                percent={weeklyProgress}
                strokeColor="#52c41a"
                className="mt-2"
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Challenges Completed"
                value={`${completedChallenges}/${weeklyChallenges.length}`}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Statistic
                title="Current Streak"
                value={streakData.currentStreak}
                suffix="days"
                prefix={<FireOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Challenges */}
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <motion.div variants={itemVariants}>
            <WeeklyStreakPanel />
          </motion.div>
        </Col>
      </Row>

      {/* Weekly Rewards Summary */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card 
          title="🎁 Weekly Rewards Summary"
          className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-3xl mb-2">🥉</div>
              <div className="font-semibold">Bronze Level</div>
              <div className="text-sm text-gray-600">Complete 1 challenge</div>
              <div className="text-sm text-purple-600 font-medium">Badge + 10% Discount</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-3xl mb-2">🥈</div>
              <div className="font-semibold">Silver Level</div>
              <div className="text-sm text-gray-600">Complete 2 challenges</div>
              <div className="text-sm text-purple-600 font-medium">Badge + Mentor Session</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-3xl mb-2">🥇</div>
              <div className="font-semibold">Gold Level</div>
              <div className="text-sm text-gray-600">Complete all 3 challenges</div>
              <div className="text-sm text-purple-600 font-medium">Premium Badge + Special Access</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default WeeklyPage;