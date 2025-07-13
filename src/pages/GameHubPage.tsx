import React from 'react';
import { Layout } from 'antd';
import GameHub from '../components/games/GameHub';
import Header from '../components/layout/Header';

const { Content } = Layout;

const GameHubPage: React.FC = () => {
  return (
    <Layout className="min-h-screen">
      <Header />
      <Content className="bg-gray-50">
        <GameHub />
      </Content>
    </Layout>
  );
};

export default GameHubPage; 