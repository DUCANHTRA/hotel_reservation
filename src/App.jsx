import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HotelListingPage from './pages/HotelListingPage';
import HotelDetailPage from './pages/HotelDetailPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ManageHotelsPage from './pages/admin/ManageHotelsPage';
import ManageRoomsPage from './pages/admin/ManageRoomsPage';
import ManageBookingsPage from './pages/admin/ManageBookingsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage'; // New import
import AdminRoute from './routes/AdminRoute';
import { auth, getUserData } from './firebase/firebase';
import useStore from './store/store';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const { setUser } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUserData(user.uid);
        setUser({ ...user, ...userData });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/hotels" element={<HotelListingPage />} />
        <Route path="/hotels/:id" element={<HotelDetailPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="hotels" element={<ManageHotelsPage />} />
          <Route path="rooms" element={<ManageRoomsPage />} />
          <Route path="bookings" element={<ManageBookingsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} /> {/* New nested route */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;