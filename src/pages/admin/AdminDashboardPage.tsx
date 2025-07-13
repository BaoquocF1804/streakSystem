import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import Analytics from '../../components/admin/Analytics';

const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <Analytics />
    </AdminLayout>
  );
};

export default AdminDashboardPage; 