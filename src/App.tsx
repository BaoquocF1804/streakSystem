import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useAppStore } from './stores/appStore';
import AuthPage from './pages/AuthPage';
import ShopPage from './pages/ShopPage';
import CheckinPage from './pages/CheckinPage';
import ShoppingStreakPage from './pages/ShoppingStreakPage';
import WeeklyPage from './pages/WeeklyPage';
import SocialDashboardPage from './pages/SocialDashboardPage';
import GameHubPage from './pages/GameHubPage';
import { Layout } from 'antd';
import Header from './components/layout/Header';

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
    },
    Modal: {
      borderRadius: 12,
    },
  },
};

const { Content } = Layout;

function App() {
  const isAuthenticated = useAppStore(state => state.isAuthenticated);

  return (
    <ConfigProvider theme={theme}>
      <Router>
        <div className="App">
          {!isAuthenticated ? (
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </Routes>
          ) : (
            <Layout className="min-h-screen">
              <Header />
              <Content className="bg-gray-50">
                <Routes>
                  <Route 
                    path="/shop" 
                    element={<ShopPage />} 
                  />
                  <Route 
                    path="/checkin" 
                    element={<CheckinPage />} 
                  />
                  <Route 
                    path="/shopping-streak" 
                    element={<ShoppingStreakPage />} 
                  />
                  <Route 
                    path="/weekly" 
                    element={<WeeklyPage />} 
                  />
                  <Route 
                    path="/social" 
                    element={<SocialDashboardPage />} 
                  />
                  <Route 
                    path="/games" 
                    element={<GameHubPage />} 
                  />
                  <Route 
                    path="/auth" 
                    element={<Navigate to="/shop" replace />} 
                  />
                  <Route 
                    path="/" 
                    element={<Navigate to="/shop" replace />} 
                  />
                </Routes>
              </Content>
            </Layout>
          )}
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;