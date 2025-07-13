import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Badge, Input, Typography, Space, Divider } from 'antd';
import { 
  DashboardOutlined, 
  UserOutlined, 
  RocketOutlined, 
  GiftOutlined, 
  BarChartOutlined, 
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ShareAltOutlined,
  MessageOutlined,
  TrophyOutlined,
  HeartOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../../stores/adminStore';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    adminUser, 
    logout, 
    notifications,
    markNotificationRead 
  } = useAdminStore();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'User Management',
    },
    {
      key: '/admin/games',
      icon: <RocketOutlined />,
      label: 'Game Config',
    },
    {
      key: '/admin/vouchers',
      icon: <GiftOutlined />,
      label: 'Voucher Management',
    },
    {
      key: '/admin/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
    },
    {
      key: 'social-hub',
      icon: <HeartOutlined />,
      label: 'Social Hub',
      children: [
        {
          key: '/admin/social/overview',
          icon: <DashboardOutlined />,
          label: 'Social Overview',
        },
        {
          key: '/admin/social/groups',
          icon: <TeamOutlined />,
          label: 'Groups/Community',
        },
        {
          key: '/admin/social/invites',
          icon: <UserOutlined />,
          label: 'Friend & Invite',
        },
        {
          key: '/admin/social/sharing',
          icon: <ShareAltOutlined />,
          label: 'Product Sharing',
        },
        {
          key: '/admin/social/reviews',
          icon: <MessageOutlined />,
          label: 'Reviews',
        },
        {
          key: '/admin/social/campaigns',
          icon: <TrophyOutlined />,
          label: 'Viral Campaign',
        },
      ],
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const notificationItems = notifications.slice(0, 5).map((notif) => ({
    key: notif.id,
    label: (
      <div 
        className="p-2 hover:bg-gray-50 cursor-pointer"
        onClick={() => markNotificationRead(notif.id)}
      >
        <div className="font-medium text-sm">{notif.title}</div>
        <div className="text-xs text-gray-500">{notif.message}</div>
        <div className="text-xs text-gray-400 mt-1">
          {new Date(notif.timestamp).toLocaleString()}
        </div>
      </div>
    ),
  }));

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={280}
        theme="light"
        className="shadow-md"
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingOutlined className="text-white text-lg" />
              </div>
              {!collapsed && (
                <div>
                  <Title level={4} className="m-0 text-gray-800">
                    Admin Panel
                  </Title>
                  <div className="text-xs text-gray-500">Teko Social Shop</div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 py-4">
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              className="border-none"
            />
          </div>

          {/* Admin Info */}
          {!collapsed && adminUser && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar 
                  size={40} 
                  src={adminUser.avatar} 
                  icon={<UserOutlined />}
                  className="bg-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{adminUser.username}</div>
                  <div className="text-xs text-gray-500">{adminUser.email}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header className="bg-white shadow-sm px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-600 hover:text-gray-900"
            />
            
            <Divider type="vertical" />
            
            <Input
              placeholder="Quick search..."
              prefix={<SearchOutlined />}
              className="w-64"
              allowClear
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Dropdown
              menu={{ items: notificationItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="text"
                icon={
                  <Badge count={unreadNotifications} size="small">
                    <BellOutlined className="text-lg" />
                  </Badge>
                }
                className="text-gray-600 hover:text-gray-900"
              />
            </Dropdown>

            {/* User Menu */}
            <Dropdown
              menu={{ items: userMenuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button
                type="text"
                className="flex items-center space-x-2 h-auto p-2 text-gray-600 hover:text-gray-900"
              >
                <Avatar 
                  size={32} 
                  src={adminUser?.avatar} 
                  icon={<UserOutlined />}
                  className="bg-blue-500"
                />
                <Space direction="vertical" size={0} className="text-left">
                  <div className="text-sm font-medium">{adminUser?.username}</div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </Space>
              </Button>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content className="p-6 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 