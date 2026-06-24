import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';
import { useUserBookings } from '../hooks/bookingHooks';
import BookingCard from '../components/BookingCard';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const { data: bookings, isLoading, isError, error } = useUserBookings(user?.uid);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">User Dashboard</h2>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-xl text-gray-700 mb-6">Welcome, {user.email}</p>

          <h3 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h3>
          {isLoading && <div className="text-center mt-4">Loading bookings...</div>}
          {isError && <div className="text-red-500 text-center mt-4">Error loading bookings: {error.message}</div>}

          {bookings && bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">You have no active bookings.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
