import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../store/store';

const AdminRoute = () => {
  const { user } = useStore();

  if (!user) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== 'admin') {
    // User is logged in but not an admin, redirect to home page
    return <Navigate to="/" replace />;
  }

  // User is logged in and is an admin, render the child routes
  return <Outlet />;
};

export default AdminRoute;
