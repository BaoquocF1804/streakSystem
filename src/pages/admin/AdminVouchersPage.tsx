import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import VoucherManagement from '../../components/admin/VoucherManagement';

const AdminVouchersPage: React.FC = () => {
  return (
    <AdminLayout>
      <VoucherManagement />
    </AdminLayout>
  );
};

export default AdminVouchersPage; 