import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { useAppStore } from './stores/appStore';
import { useAdminStore } from './stores/adminStore';
import AuthPage from './pages/AuthPage';
import ShopPage from './pages/ShopPage';
import CheckinPage from './pages/CheckinPage';
import ShoppingStreakPage from './pages/ShoppingStreakPage';
import WeeklyPage from './pages/WeeklyPage';
import SocialDashboardPage from './pages/SocialDashboardPage';
import GameHubPage from './pages/GameHubPage';
import { Layout } from 'antd';
import Header from './components/layout/Header';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminGamesPage from './pages/admin/AdminGamesPage';
import AdminVouchersPage from './pages/admin/AdminVouchersPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

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
  const isAdminAuthenticated = useAdminStore(state => state.isAuthenticated);

  return (
    <ConfigProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin/*" 
              element={
                isAdminAuthenticated ? (
                  <Routes>
                    <Route path="/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/users" element={<AdminUsersPage />} />
                    <Route path="/games" element={<AdminGamesPage />} />
                    <Route path="/vouchers" element={<AdminVouchersPage />} />
                    <Route path="/analytics" element={<AdminAnalyticsPage />} />
                    <Route path="/settings" element={<AdminSettingsPage />} />
                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                ) : (
                  <Navigate to="/admin/login" replace />
                )
              } 
            />

            {/* User Routes */}
            {!isAuthenticated ? (
              <>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/auth" replace />} />
              </>
            ) : (
              <>
                <Route path="/shop" element={
                  <Layout className="min-h-screen">
                    <Header />
                    <Content className="bg-gray-50">
                      <ShopPage />
                    </Content>
                  </Layout>
                } />
                <Route path="/checkin" element={
                  <Layout className="min-h-screen">
                    <Header />
                    <Content className="bg-gray-50">
                      <CheckinPage />
                    </Content>
                  </Layout>
                } />
                <Route path="/shopping-streak" element={
                  <Layout className="min-h-screen">
                    <Header />
                    <Content className="bg-gray-50">
                      <ShoppingStreakPage />
                    </Content>
                  </Layout>
                } />
                <Route path="/weekly" element={
                  <Layout className="min-h-screen">
                    <Header />
                    <Content className="bg-gray-50">
                      <WeeklyPage />
                    </Content>
                  </Layout>
                } />
                <Route path="/social" element={
                  <Layout className="min-h-screen">
                    <Header />
                    <Content className="bg-gray-50">
                      <SocialDashboardPage />
                    </Content>
                  </Layout>
                } />
                <Route path="/games" element={
                  <Layout className="min-h-screen">
                    <Header />
                    <Content className="bg-gray-50">
                      <GameHubPage />
                    </Content>
                  </Layout>
                } />
                <Route path="/auth" element={<Navigate to="/shop" replace />} />
                <Route path="/" element={<Navigate to="/shop" replace />} />
              </>
            )}
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;