import React, { useState } from 'react';
import { Row, Col, Card, Tabs, Badge, Button } from 'antd';
import { ShareAltOutlined, MessageOutlined, ShoppingOutlined, UserOutlined, TrophyOutlined, TeamOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Dashboard from '../components/Dashboard';
import ProductShare from '../components/ProductShare';
import ReviewChallenge from '../components/ReviewChallenge';
import GroupBuy from '../components/GroupBuy';
import { useAppStore } from '../stores/appStore';

const SocialDashboardPage: React.FC = () => {
  const { user } = useAppStore();

  // Mock data for social commerce features
  const mockStats = {
    totalShares: 24,
    completedReviews: 8,
    groupBuysJoined: 5,
    pointsEarned: 12450,
    friendsConnected: 32,
    badgesEarned: 7
  };

  const mockProduct = {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro Max 256GB',
    price: 34990000,
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?w=400&h=400&fit=crop',
    rating: 4.8,
    category: 'Điện thoại',
    description: 'Latest iPhone with advanced features'
  };

  const mockReviewChallenge = {
    id: 'review-1',
    product: {
      name: 'MacBook Air M3 13" 256GB',
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?w=400&h=400&fit=crop',
      price: 28990000
    },
    participants: [
      { 
        id: '1', 
        name: 'Minh Anh', 
        email: 'minh@example.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop' 
      },
      { 
        id: '2', 
        name: 'Thùy Linh', 
        email: 'thuy@example.com',
        avatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?w=100&h=100&fit=crop' 
      }
    ],
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'in_progress' as const,
    progress: [
      { userId: '1', reviewCompleted: false, imagesUploaded: 1, textLength: 150 },
      { userId: '2', reviewCompleted: true, imagesUploaded: 3, textLength: 250 }
    ],
    rewards: {
      points: 500,
      voucher: 'REVIEW50',
    }
  };

  const mockGroupBuy = {
    id: 'group-1',
    product: {
      name: 'AirPods Pro (2nd Gen)',
      image: 'https://images.pexels.com/photos/6765363/pexels-photo-6765363.jpeg?w=400&h=400&fit=crop',
      originalPrice: 6990000,
      discountedPrice: 5990000,
      category: 'Tai nghe'
    },
    organizer: {
      id: 'organizer-1',
      name: 'Đức Minh',
      email: 'duc@example.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop'
    },
    participants: [
      { 
        id: '1', 
        name: 'Mai Anh', 
        email: 'mai@example.com',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop', 
        joinedAt: new Date() 
      },
      { 
        id: '2', 
        name: 'Thúy Nga', 
        email: 'nga@example.com',
        avatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?w=100&h=100&fit=crop', 
        joinedAt: new Date() 
      },
      { 
        id: '3', 
        name: 'Hoàng Long', 
        email: 'long@example.com',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=100&h=100&fit=crop', 
        joinedAt: new Date() 
      }
    ],
    targetCount: 5,
    currentCount: 3,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'recruiting' as const
  };

  const handleShare = (product: any, platform: string) => {
    console.log(`Sharing ${product.name} on ${platform}`);
    // Implement share logic here
  };

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

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined />
          Tổng quan
        </span>
      ),
      children: <Dashboard stats={mockStats} />
    },
    {
      key: '2',
      label: (
        <span>
          <ShareAltOutlined />
          Chia sẻ
        </span>
      ),
      children: <ProductShare product={mockProduct} onShare={handleShare} />
    },
    {
      key: '3',
      label: (
        <span>
          <MessageOutlined />
          Review
        </span>
      ),
      children: <ReviewChallenge challenge={mockReviewChallenge} />
    },
    {
      key: '4',
      label: (
        <span>
          <ShoppingOutlined />
          Mua chung
        </span>
      ),
      children: <GroupBuy groupBuy={mockGroupBuy} />
    }
  ];

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
            Social Commerce Hub 🤝
          </h1>
          <p className="text-lg text-gray-600">
            Kết nối, chia sẻ và mua sắm cùng bạn bè
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="mb-8">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mockStats.totalShares}</div>
              <div className="text-gray-600">Sản phẩm đã chia sẻ</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockStats.completedReviews}</div>
              <div className="text-gray-600">Review hoàn thành</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-purple-600">{mockStats.groupBuysJoined}</div>
              <div className="text-gray-600">Nhóm mua tham gia</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center">
              <div className="text-2xl font-bold text-orange-600">{mockStats.pointsEarned.toLocaleString()}</div>
              <div className="text-gray-600">Điểm tích lũy</div>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-lg">
          <Tabs 
            defaultActiveKey="1" 
            items={tabItems}
            size="large"
            className="min-h-96"
          />
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SocialDashboardPage; 