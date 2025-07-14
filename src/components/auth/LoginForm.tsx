import React, { useState } from 'react';
import { Card, Form, Input, Button, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [loading, setLoading] = useState(false);
  const login = useAppStore(state => state.login);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await login(values.email, values.password);
      if (result && result.success) {
        message.success('Đăng nhập thành công!');
        if (result.offer_notification) {
          const offer = result.offer_notification as any;
          if (typeof offer === 'object' && offer.title && offer.message) {
            message.info(`${offer.title}\n${offer.message}`);
          } else if (typeof offer === 'string') {
            message.info(offer);
          }
        }
      }
    } catch (error) {
      message.error('Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4"
    >
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">🛍️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Chào mừng trở lại!
          </h1>
          <p className="text-gray-600">
            Đăng nhập mỗi ngày để giữ streak nhận quà hấp dẫn!
          </p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 border-none"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider>hoặc</Divider>

        <Button
          icon={<GoogleOutlined />}
          className="w-full h-12 rounded-lg mb-4"
          size="large"
        >
          Đăng nhập với Google
        </Button>

        <div className="text-center">
          <span className="text-gray-600">Chưa có tài khoản? </span>
          <Button
            type="link"
            onClick={onSwitchToRegister}
            className="p-0 font-semibold"
          >
            Đăng ký ngay
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default LoginForm;