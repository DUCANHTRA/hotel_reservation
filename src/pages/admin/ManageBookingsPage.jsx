import React from 'react';
import { useAllBookings, useUpdateBookingStatus } from '../../hooks/bookingHooks';
import Navbar from '../../components/Navbar';

const ManageBookingsPage = () => {
  const { data: bookings, isLoading, isError, error } = useAllBookings();
  const { mutate: updateBookingStatus } = useUpdateBookingStatus();

  const handleStatusChange = (bookingId, newStatus) => {
    if (window.confirm(`Are you sure you want to change the status of booking ${bookingId} to ${newStatus}?`)) {
      updateBookingStatus({ bookingId, status: newStatus });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Loading...</p>
    </div>
  );
  if (isError) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Error: {error.message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-2xl md:text-3xl font-light tracking-wider text-ink">Manage Bookings</h1>
        <div className="w-12 h-px bg-ink-200 mt-4 mb-6" />

        <div className="bg-paper overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-paper-dark">
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Booking ID</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">User</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Hotel</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Room Type</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Check-in</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Check-out</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Total</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Guests</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Status</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-paper-dark">
                    <td className="px-6 py-4 text-sm text-ink-300">{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-ink-300">{booking.user ? booking.user.email : booking.userId}</td>
                    <td className="px-6 py-4 text-sm text-ink-300">{booking.hotel ? booking.hotel.name : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-ink-300">{booking.room ? booking.room.type : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-ink-300">{booking.checkInDate}</td>
                    <td className="px-6 py-4 text-sm text-ink-300">{booking.checkOutDate}</td>
                    <td className="px-6 py-4 text-sm text-ink-300">${booking.totalPrice}</td>
                    <td className="px-6 py-4 text-sm text-ink-300">{booking.numberOfGuests}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`${booking.status === 'confirmed' ? 'text-ink' : 'text-ink-200'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-8 text-xs tracking-widest uppercase text-ink-300 text-center">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ManageBookingsPage;
