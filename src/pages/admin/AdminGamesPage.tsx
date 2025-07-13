import React from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import GameConfiguration from '../../components/admin/GameConfiguration';

const AdminGamesPage: React.FC = () => {
  return (
    <AdminLayout>
      <GameConfiguration />
    </AdminLayout>
  );
};

export default AdminGamesPage; 