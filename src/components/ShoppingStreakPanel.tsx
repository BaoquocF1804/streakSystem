import React from 'react';
import { Card, List, Tag, Button, Statistic } from 'antd';
import { ShoppingOutlined, CalendarOutlined, GiftOutlined, FireOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useStreakStore } from '../stores/streakStore';
import dayjs from 'dayjs';

const ShoppingStreakPanel: React.FC = () => {
  const { shoppingOrders, streakData } = useStreakStore();

  const shoppingStreak = shoppingOrders.filter(order => 
    dayjs().diff(dayjs(order.date), 'day') < 7 && order.contributeToStreak
  ).length;

  const totalSpent = shoppingOrders.reduce((sum, order) => sum + order.amount, 0);
  const recentOrders = shoppingOrders.slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Shopping Streak Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <ShoppingOutlined className="mr-2 text-purple-500" />
            Shopping Streak
          </h3>
          <div className="flex items-center space-x-2">
            <FireOutlined className="text-orange-500" />
            <span className="text-2xl font-bold text-purple-600">{shoppingStreak}</span>
            <span className="text-sm text-gray-600">days</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Statistic
            title="Total Orders"
            value={shoppingOrders.length}
            prefix={<ShoppingOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
          <Statistic
            title="Total Spent"
            value={totalSpent}
            formatter={(value) => formatCurrency(Number(value))}
            valueStyle={{ color: '#52c41a' }}
          />
        </div>

        {/* Shopping Rewards Banner */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-yellow-800">
                🎁 Shopping Reward Available!
              </div>
              <div className="text-sm text-yellow-700">
                Reach 7-day shopping streak for 20% discount
              </div>
            </div>
            <Tag color="gold">{7 - shoppingStreak} days left</Tag>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <Card
        title={
          <div className="flex items-center">
            <CalendarOutlined className="mr-2" />
            Recent Shopping History
          </div>
        }
        extra={
          <Button type="link" size="small">
            View All
          </Button>
        }
      >
        <List
          dataSource={recentOrders}
          renderItem={(order, index) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <List.Item
                actions={[
                  order.contributeToStreak ? (
                    <Tag color="success" icon={<FireOutlined />}>
                      Streak +1
                    </Tag>
                  ) : (
                    <Tag color="default">No Streak</Tag>
                  )
                ]}
              >
                <List.Item.Meta
                  title={
                    <div className="flex items-center justify-between">
                      <span>{order.items.join(', ')}</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(order.amount)}
                      </span>
                    </div>
                  }
                  description={
                    <div className="flex items-center text-gray-500">
                      <CalendarOutlined className="mr-1" />
                      {dayjs(order.date).format('DD/MM/YYYY')}
                    </div>
                  }
                />
              </List.Item>
            </motion.div>
          )}
        />
        
        {recentOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ShoppingOutlined className="text-4xl mb-2 opacity-50" />
            <div>No recent orders</div>
            <div className="text-sm">Start shopping to build your streak!</div>
          </div>
        )}
      </Card>

      {/* Quick Shopping Action */}
      <Card className="text-center">
        <div className="py-4">
          <div className="text-lg font-semibold mb-2">Keep Your Shopping Streak Alive!</div>
          <div className="text-gray-600 mb-4">
            Make a purchase today to continue your {shoppingStreak}-day streak
          </div>
          <Button
            type="primary"
            size="large"
            icon={<ShoppingOutlined />}
            className="bg-purple-500 border-purple-500"
          >
            Shop Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ShoppingStreakPanel;