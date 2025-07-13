import React from 'react';
import { Row, Col } from 'antd';
import { motion } from 'framer-motion';
import StreakCalendar from '../components/StreakCalendar';
import ShoppingStreakPanel from '../components/ShoppingStreakPanel';

const ShoppingPage: React.FC = () => {
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
            Shopping Streak 🛍️
          </h1>
          <p className="text-lg text-gray-600">
            Track your shopping habits and earn exclusive rewards
          </p>
        </div>
      </motion.div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Calendar */}
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <StreakCalendar type="shopping" />
          </motion.div>
        </Col>

        {/* Right Column - Shopping Panel */}
        <Col xs={24} lg={12}>
          <motion.div variants={itemVariants}>
            <ShoppingStreakPanel />
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  );
};

export default ShoppingPage;