import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Switch, 
  InputNumber, 
  Button, 
  Tabs, 
  Divider, 
  message,
  Space,
  Row,
  Col,
  Typography,
  Alert,
  Tooltip,
  Badge,
  Statistic,
  Modal
} from 'antd';
import { 
  SaveOutlined, 
  ReloadOutlined, 
  SyncOutlined, 
  SettingOutlined,
  RocketOutlined,
  ShoppingOutlined,
  UserOutlined,
  TrophyOutlined,
  BellOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useConfigStore } from '../../stores/configStore';
import { useAdminStore } from '../../stores/adminStore';

const { Title, Text } = Typography;

const GlobalConfigPage: React.FC = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('games');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any>(null);
  
  const { config, updateConfig, resetConfig, resetConfigSection, lastUpdated, isLoading } = useConfigStore();
  const { loading: adminLoading, addNotification } = useAdminStore();

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const handleSave = async (values: any) => {
    try {
      updateConfig(values);
      message.success('Configuration updated successfully!');
      
      // Add notification to admin
      addNotification({
        type: 'success',
        title: 'Global Configuration Updated',
        message: 'Settings have been applied system-wide',
        isRead: false
      });
      
      // Reset form to show saved state
      form.setFieldsValue(values);
    } catch (error) {
      message.error('Failed to update configuration');
    }
  };

  const handleSyncToUsers = async () => {
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Configuration synced to all users!');
      
      addNotification({
        type: 'success',
        title: 'Configuration Synced',
        message: 'All users have been updated with latest settings',
        isRead: false
      });
    } catch (error) {
      message.error('Failed to sync configuration');
    }
  };

  const handleReset = (section?: string) => {
    Modal.confirm({
      title: `Reset ${section ? section : 'all'} configuration?`,
      content: 'This action cannot be undone. All settings will be reset to defaults.',
      icon: <WarningOutlined />,
      okText: 'Reset',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        if (section) {
          resetConfigSection(section as keyof typeof config);
          message.success(`${section} configuration reset to defaults`);
        } else {
          resetConfig();
          message.success('All configuration reset to defaults');
        }
        form.setFieldsValue(config);
      },
    });
  };

  const handleFormChange = (changedFields: any, allFields: any) => {
    // Track changes for confirmation modal
    setPendingChanges(allFields);
  };

  const tabItems = [
    {
      key: 'games',
      label: (
        <span>
          <RocketOutlined />
          Games
        </span>
      ),
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>Game Configuration</Title>
            <Button 
              size="small" 
              danger 
              onClick={() => handleReset('games')}
            >
              Reset Games
            </Button>
          </div>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Max Daily Plays"
                name={['games', 'maxDailyPlays']}
                tooltip="Maximum number of games a user can play per day"
                rules={[{ required: true, message: 'Please enter max daily plays' }]}
              >
                <InputNumber 
                  min={1} 
                  max={100} 
                  style={{ width: '100%' }}
                  addonAfter="games/day"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Streak Bonus Multiplier"
                name={['games', 'streakBonusMultiplier']}
                tooltip="Multiplier for streak bonuses"
                rules={[{ required: true, message: 'Please enter streak multiplier' }]}
              >
                <InputNumber 
                  min={1} 
                  max={5} 
                  step={0.1} 
                  style={{ width: '100%' }}
                  addonAfter="x"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Points Per Game"
                name={['games', 'pointsPerGame']}
                tooltip="Base points awarded per game completion"
              >
                <InputNumber 
                  min={10} 
                  max={1000} 
                  style={{ width: '100%' }}
                  addonAfter="points"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Experience Per Game"
                name={['games', 'experiencePerGame']}
                tooltip="Base experience awarded per game"
              >
                <InputNumber 
                  min={1} 
                  max={500} 
                  style={{ width: '100%' }}
                  addonAfter="exp"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Memory Game Timeout"
                name={['games', 'timeouts', 'memoryGame']}
                tooltip="Time limit for memory game in seconds"
              >
                <InputNumber 
                  min={30} 
                  max={300} 
                  style={{ width: '100%' }}
                  addonAfter="seconds"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Math Quiz Timeout"
                name={['games', 'timeouts', 'mathQuiz']}
                tooltip="Time limit for math quiz in seconds"
              >
                <InputNumber 
                  min={15} 
                  max={120} 
                  style={{ width: '100%' }}
                  addonAfter="seconds"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Enable Multiplayer"
                name={['games', 'enableMultiplayer']}
                valuePropName="checked"
                tooltip="Allow multiplayer games"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Achievement Multiplier"
                name={['games', 'achievementMultiplier']}
                tooltip="Multiplier for achievement rewards"
              >
                <InputNumber 
                  min={1} 
                  max={10} 
                  step={0.5} 
                  style={{ width: '100%' }}
                  addonAfter="x"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'shop',
      label: (
        <span>
          <ShoppingOutlined />
          Shop
        </span>
      ),
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>Shop Configuration</Title>
            <Button 
              size="small" 
              danger 
              onClick={() => handleReset('shop')}
            >
              Reset Shop
            </Button>
          </div>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Max Daily Vouchers"
                name={['shop', 'maxDailyVouchers']}
                tooltip="Maximum vouchers a user can receive per day"
              >
                <InputNumber 
                  min={1} 
                  max={50} 
                  style={{ width: '100%' }}
                  addonAfter="vouchers/day"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Streak Required for Discounts"
                name={['shop', 'streakRequiredForDiscounts']}
                tooltip="Minimum streak required to unlock discounts"
              >
                <InputNumber 
                  min={1} 
                  max={30} 
                  style={{ width: '100%' }}
                  addonAfter="days"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Minimum Group Size"
                name={['shop', 'minimumGroupSize']}
                tooltip="Minimum participants required for group buying"
              >
                <InputNumber 
                  min={2} 
                  max={20} 
                  style={{ width: '100%' }}
                  addonAfter="people"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Maximum Group Size"
                name={['shop', 'maxGroupSize']}
                tooltip="Maximum participants allowed in group buying"
              >
                <InputNumber 
                  min={5} 
                  max={100} 
                  style={{ width: '100%' }}
                  addonAfter="people"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Discount Percentage"
                name={['shop', 'discountPercentage']}
                tooltip="Default discount percentage for group buying"
              >
                <InputNumber 
                  min={5} 
                  max={50} 
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Free Shipping Threshold"
                name={['shop', 'freeShippingThreshold']}
                tooltip="Minimum order value for free shipping"
              >
                <InputNumber 
                  min={100000} 
                  max={2000000} 
                  step={50000}
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, '')) as any}
                  addonAfter="VND"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Enable Group Buy"
                name={['shop', 'enableGroupBuy']}
                valuePropName="checked"
                tooltip="Allow group buying feature"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'limits',
      label: (
        <span>
          <UserOutlined />
          User Limits
        </span>
      ),
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>User Limits Configuration</Title>
            <Button 
              size="small" 
              danger 
              onClick={() => handleReset('limits')}
            >
              Reset Limits
            </Button>
          </div>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Max Daily Check-ins"
                name={['limits', 'maxDailyCheckIns']}
                tooltip="Maximum check-ins per day"
              >
                <InputNumber 
                  min={1} 
                  max={5} 
                  style={{ width: '100%' }}
                  addonAfter="check-ins/day"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Points Per Day"
                name={['limits', 'maxPointsPerDay']}
                tooltip="Maximum points a user can earn per day"
              >
                <InputNumber 
                  min={500} 
                  max={10000} 
                  step={100}
                  style={{ width: '100%' }}
                  addonAfter="points/day"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Streak Bonus"
                name={['limits', 'maxStreakBonus']}
                tooltip="Maximum bonus points from streaks"
              >
                <InputNumber 
                  min={100} 
                  max={2000} 
                  step={50}
                  style={{ width: '100%' }}
                  addonAfter="points"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Vouchers Per User"
                name={['limits', 'maxVouchersPerUser']}
                tooltip="Maximum vouchers a user can hold"
              >
                <InputNumber 
                  min={10} 
                  max={100} 
                  style={{ width: '100%' }}
                  addonAfter="vouchers"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Games Per Session"
                name={['limits', 'maxGamesPerSession']}
                tooltip="Maximum games in a single session"
              >
                <InputNumber 
                  min={3} 
                  max={20} 
                  style={{ width: '100%' }}
                  addonAfter="games/session"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'features',
      label: (
        <span>
          <TrophyOutlined />
          Features
        </span>
      ),
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>Feature Toggles</Title>
            <Button 
              size="small" 
              danger 
              onClick={() => handleReset('features')}
            >
              Reset Features
            </Button>
          </div>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Social Commerce"
                name={['features', 'socialCommerce']}
                valuePropName="checked"
                tooltip="Enable social commerce features"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Community Trees"
                name={['features', 'communityTrees']}
                valuePropName="checked"
                tooltip="Enable community tree planting game"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Weekly Streaks"
                name={['features', 'weeklyStreaks']}
                valuePropName="checked"
                tooltip="Enable weekly streak challenges"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Review Challenges"
                name={['features', 'reviewChallenges']}
                valuePropName="checked"
                tooltip="Enable product review challenges"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Friend Invites"
                name={['features', 'friendInvites']}
                valuePropName="checked"
                tooltip="Enable friend invitation system"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Product Sharing"
                name={['features', 'productSharing']}
                valuePropName="checked"
                tooltip="Enable product sharing features"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Multiplayer Games"
                name={['features', 'multiplayerGames']}
                valuePropName="checked"
                tooltip="Enable multiplayer game modes"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'streaks',
      label: (
        <span>
          <TrophyOutlined />
          Streaks
        </span>
      ),
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>Streak Configuration</Title>
            <Button 
              size="small" 
              danger 
              onClick={() => handleReset('streaks')}
            >
              Reset Streaks
            </Button>
          </div>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Daily Check-in Bonus"
                name={['streaks', 'dailyCheckinBonus']}
                tooltip="Points awarded for daily check-ins"
              >
                <InputNumber 
                  min={5} 
                  max={100} 
                  style={{ width: '100%' }}
                  addonAfter="points"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Weekly Streak Bonus"
                name={['streaks', 'weeklyStreakBonus']}
                tooltip="Bonus points for weekly streaks"
              >
                <InputNumber 
                  min={50} 
                  max={500} 
                  step={10}
                  style={{ width: '100%' }}
                  addonAfter="points"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Monthly Streak Bonus"
                name={['streaks', 'monthlyStreakBonus']}
                tooltip="Bonus points for monthly streaks"
              >
                <InputNumber 
                  min={200} 
                  max={2000} 
                  step={50}
                  style={{ width: '100%' }}
                  addonAfter="points"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Max Streak Multiplier"
                name={['streaks', 'maxStreakMultiplier']}
                tooltip="Maximum multiplier for long streaks"
              >
                <InputNumber 
                  min={2} 
                  max={10} 
                  step={0.5}
                  style={{ width: '100%' }}
                  addonAfter="x"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Reset Grace Period"
                name={['streaks', 'resetGracePeriod']}
                tooltip="Hours before streak resets"
              >
                <InputNumber 
                  min={6} 
                  max={48} 
                  style={{ width: '100%' }}
                  addonAfter="hours"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'notifications',
      label: (
        <span>
          <BellOutlined />
          Notifications
        </span>
      ),
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>Notification Settings</Title>
            <Button 
              size="small" 
              danger 
              onClick={() => handleReset('notifications')}
            >
              Reset Notifications
            </Button>
          </div>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Enable Push Notifications"
                name={['notifications', 'enablePush']}
                valuePropName="checked"
                tooltip="Enable push notifications"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Enable Email Notifications"
                name={['notifications', 'enableEmail']}
                valuePropName="checked"
                tooltip="Enable email notifications"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Streak Reminders"
                name={['notifications', 'streakReminders']}
                valuePropName="checked"
                tooltip="Send streak reminder notifications"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Game Invites"
                name={['notifications', 'gameInvites']}
                valuePropName="checked"
                tooltip="Send game invitation notifications"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Voucher Expiry"
                name={['notifications', 'voucherExpiry']}
                valuePropName="checked"
                tooltip="Send voucher expiry notifications"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="New Product Alerts"
                name={['notifications', 'newProductAlerts']}
                valuePropName="checked"
                tooltip="Send new product notifications"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'system',
      label: (
        <span>
          <SettingOutlined />
          System
        </span>
      ),
      children: (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>System Settings</Title>
            <Button 
              size="small" 
              danger 
              onClick={() => handleReset('system')}
            >
              Reset System
            </Button>
          </div>
          
          <Alert
            message="System Settings"
            description="These settings affect core system behavior. Please be careful when making changes."
            type="warning"
            className="mb-4"
          />
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Maintenance Mode"
                name={['system', 'maintenanceMode']}
                valuePropName="checked"
                tooltip="Enable maintenance mode (users cannot access the system)"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Allow New Registrations"
                name={['system', 'allowNewRegistrations']}
                valuePropName="checked"
                tooltip="Allow new user registrations"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Session Timeout"
                name={['system', 'sessionTimeout']}
                tooltip="User session timeout in minutes"
              >
                <InputNumber 
                  min={15} 
                  max={480} 
                  style={{ width: '100%' }}
                  addonAfter="minutes"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Auto Save Interval"
                name={['system', 'autoSaveInterval']}
                tooltip="Auto save interval in seconds"
              >
                <InputNumber 
                  min={10} 
                  max={300} 
                  style={{ width: '100%' }}
                  addonAfter="seconds"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <Title level={2} className="mb-2">
              <SettingOutlined className="mr-2" />
              Global Configuration
            </Title>
            <Text type="secondary">
              Configure system-wide settings that affect all users
            </Text>
          </div>
          <div className="flex items-center space-x-2">
            <Badge status="processing" text={`Last updated: ${new Date(lastUpdated).toLocaleString()}`} />
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Active Features"
              value={Object.values(config.features).filter(Boolean).length}
              suffix={`/ ${Object.keys(config.features).length}`}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Daily Game Limit"
              value={config.games.maxDailyPlays}
              suffix="games"
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Daily Voucher Limit"
              value={config.shop.maxDailyVouchers}
              suffix="vouchers"
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Configuration Form */}
      <Card>
        <div className="flex justify-between items-center mb-6">
          <Title level={3}>Configuration Settings</Title>
          <Space>
            <Button
              icon={<SyncOutlined />}
              onClick={handleSyncToUsers}
              loading={adminLoading}
            >
              Sync to Users
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => handleReset()}
              danger
            >
              Reset All
            </Button>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          initialValues={config}
          onFinish={handleSave}
          onFieldsChange={handleFormChange}
        >
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            type="card"
          />
          
          <Divider />
          
          <div className="flex justify-end">
            <Space>
              <Button htmlType="button" onClick={() => form.resetFields()}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                loading={isLoading || adminLoading}
              >
                Save Configuration
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default GlobalConfigPage; 