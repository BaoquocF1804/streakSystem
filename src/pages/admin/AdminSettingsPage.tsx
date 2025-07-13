import React from 'react';
import { Card, Form, Input, Switch, Button, Divider, InputNumber, Space, message } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAdminStore } from '../../stores/adminStore';

const AdminSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const { settings, updateSettings, loading } = useAdminStore();

  const handleSave = async (values: any) => {
    try {
      await updateSettings(values);
      message.success('Settings updated successfully!');
    } catch (error) {
      message.error('Failed to update settings');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        <Card>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={settings}
          >
            <Card title="General Settings" className="mb-6">
              <Form.Item
                label="Site Name"
                name={['general', 'siteName']}
                rules={[{ required: true, message: 'Please enter site name' }]}
              >
                <Input placeholder="Enter site name" />
              </Form.Item>

              <Form.Item
                label="Maintenance Mode"
                name={['general', 'maintenanceMode']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Allow Registration"
                name={['general', 'allowRegistration']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Max Daily Games"
                name={['general', 'maxDailyGames']}
                rules={[{ required: true, message: 'Please enter max daily games' }]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Max Daily Vouchers"
                name={['general', 'maxDailyVouchers']}
                rules={[{ required: true, message: 'Please enter max daily vouchers' }]}
              >
                <InputNumber min={1} max={50} style={{ width: '100%' }} />
              </Form.Item>
            </Card>

            <Card title="Notification Settings" className="mb-6">
              <Form.Item
                label="Email Notifications"
                name={['notifications', 'emailEnabled']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Push Notifications"
                name={['notifications', 'pushEnabled']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Admin Alerts"
                name={['notifications', 'adminAlerts']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="User Alerts"
                name={['notifications', 'userAlerts']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>

            <Card title="Security Settings" className="mb-6">
              <Form.Item
                label="Session Timeout (seconds)"
                name={['security', 'sessionTimeout']}
                rules={[{ required: true, message: 'Please enter session timeout' }]}
              >
                <InputNumber min={300} max={86400} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Max Login Attempts"
                name={['security', 'maxLoginAttempts']}
                rules={[{ required: true, message: 'Please enter max login attempts' }]}
              >
                <InputNumber min={1} max={20} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Password Min Length"
                name={['security', 'passwordMinLength']}
                rules={[{ required: true, message: 'Please enter password min length' }]}
              >
                <InputNumber min={4} max={32} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="Require Email Verification"
                name={['security', 'requireEmailVerification']}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>

            <div className="text-center">
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                >
                  Save Settings
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => form.resetFields()}
                  size="large"
                >
                  Reset
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      </motion.div>
  );
};

export default AdminSettingsPage; 