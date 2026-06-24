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

  if (isLoading) return <div className="text-center mt-8 text-xl">Loading bookings...</div>;
  if (isError) return <div className="text-center mt-8 text-red-500 text-xl">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Bookings</h1>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings && bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.user ? booking.user.email : booking.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.hotel ? booking.hotel.name : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.room ? booking.room.type : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.checkInDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.checkOutDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${booking.totalPrice}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{booking.numberOfGuests}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageBookingsPage;
