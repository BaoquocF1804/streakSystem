import React, { useState } from 'react';
import { Card, Form, Input, Button, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [loading, setLoading] = useState(false);
  const register = useAppStore(state => state.register);

  const onFinish = async (values: { email: string; password: string; name: string }) => {
    setLoading(true);
    try {
      const success = await register(values.email, values.password, values.name);
      if (success) {
        message.success('Đăng ký thành công!');
      }
    } catch (error) {
      message.error('Đăng ký thất bại!');
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
            <span className="text-2xl text-white">🚀</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-gray-600">
            Tham gia cộng đồng và bắt đầu hành trình streak của bạn!
          </p>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
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
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <Divider>hoặc</Divider>

        <Button
          icon={<GoogleOutlined />}
          className="w-full h-12 rounded-lg mb-4"
          size="large"
        >
          Đăng ký với Google
        </Button>

        <div className="text-center">
          <span className="text-gray-600">Đã có tài khoản? </span>
          <Button
            type="link"
            onClick={onSwitchToLogin}
            className="p-0 font-semibold"
          >
            Đăng nhập ngay
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default RegisterForm;