import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, CalendarOutlined, TrophyOutlined, ShoppingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import StreakCalendar from '../components/StreakCalendar';
import StreakProgress from '../components/StreakProgress';
import CheckInButton from '../components/CheckInButton';
import { useStreakStore } from '../stores/streakStore';

const DashboardPage: React.FC = () => {
  const { streakData, shoppingOrders } = useStreakStore();

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
            Welcome to Teko Innovation Hub 🚀
          </h1>
          <p className="text-lg text-gray-600">
            Maintain your streak, earn rewards, and drive innovation forward
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
                value={streakData.currentStreak}
                prefix={<CalendarOutlined />}
                suffix="days"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Check-ins"
                value={streakData.totalCheckIns}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Rewards Earned"
                value={streakData.rewardsEarned.filter(r => r.earned).length}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Shopping Orders"
                value={shoppingOrders.length}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </motion.div>

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

      {/* Innovation Tips */}
      <motion.div variants={itemVariants} className="mt-8">
        <Card 
          title="💡 Innovation Tips"
          className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🎯 Stay Consistent</h4>
              <p className="text-sm text-gray-600">
                Daily check-ins help build habits and keep you connected with the innovation community.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🤝 Collaborate</h4>
              <p className="text-sm text-gray-600">
                Engage with other projects and teams to earn collaboration streaks and unlock special rewards.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">🏆 Earn Rewards</h4>
              <p className="text-sm text-gray-600">
                Maintain your streaks to unlock badges, mentor sessions, and priority demo slots.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">📈 Track Progress</h4>
              <p className="text-sm text-gray-600">
                Monitor your innovation journey and see how your consistency drives results.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;