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
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="mb-12">
          <p className="text-xs tracking-[0.25em] uppercase text-ink-300">Dashboard</p>
          <h2 className="text-2xl md:text-3xl font-light tracking-wider text-ink mt-3">
            Welcome back
          </h2>
          <div className="w-12 h-px bg-ink-200 mt-6" />
        </div>

        <h3 className="text-sm font-bold tracking-wider uppercase text-ink mb-6">My Bookings</h3>
        {isLoading && <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-12">Loading...</p>}
        {isError && <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-12">Error: {error.message}</p>}

        {bookings && bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : (
          <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-12">No bookings yet.</p>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
