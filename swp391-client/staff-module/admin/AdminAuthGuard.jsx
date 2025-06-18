import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminAuthGuard = ({ children }) => {
  // Thay thế bằng logic kiểm tra quyền thực tế của bạn
  const isAdmin = localStorage.getItem('userRole') === 'ADMIN';

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminAuthGuard; 