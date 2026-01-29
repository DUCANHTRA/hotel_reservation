import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../store/store';

const AdminRoute = () => {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
