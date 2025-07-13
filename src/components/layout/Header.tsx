import React from 'react';
import { Layout, Avatar, Badge, Dropdown, Button, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, FireOutlined, ShoppingOutlined, CalendarOutlined, HomeOutlined, ShareAltOutlined, MessageOutlined, TeamOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import StreakWidget from '../streak/StreakWidget';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/shop',
      icon: <HomeOutlined />,
      label: 'Shop',
    },
    {
      key: '/checkin',
      icon: <CalendarOutlined />,
      label: 'Daily Check-in',
    },
    {
      key: '/shopping-streak',
      icon: <ShoppingOutlined />,
      label: 'Shopping Streak',
    },
    {
      key: '/weekly',
      icon: <FireOutlined />,
      label: 'Weekly Challenges',
    },
    {
      key: '/social',
      icon: <ShareAltOutlined />,
      label: 'Social Commerce',
    },
    {
      key: '/games',
      icon: <TeamOutlined />,
      label: 'Game Hub',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: logout,
    },
  ];

  return (
    <AntHeader className="bg-white shadow-sm px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ShoppingOutlined className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Teko Social Shop</h1>
            <p className="text-sm text-gray-600">Innovation & Social Commerce</p>
          </div>
        </motion.div>

        {/* Navigation Menu */}
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="border-none bg-transparent min-w-0 flex-1"
          style={{
            lineHeight: '64px',
          }}
        />
      </div>

      <div className="flex items-center space-x-6">
        {/* Streak Widget */}
        <StreakWidget />

        {/* User Menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Button
            type="text"
            className="flex items-center space-x-2 h-auto p-2"
          >
            <Avatar
              src={user?.avatar}
              icon={<UserOutlined />}
              className="bg-blue-500"
            />
            <div className="text-left hidden md:block">
              <div className="text-sm font-medium text-gray-800">
                {user?.name}
              </div>
              <div className="text-xs text-gray-600">
                {user?.email}
              </div>
            </div>
          </Button>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;