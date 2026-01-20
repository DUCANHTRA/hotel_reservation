import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCancelBooking } from '../hooks/bookingHooks';

const BookingCard = ({ booking }) => {
  const [cancelMessage, setCancelMessage] = useState({ type: '', text: '' });
  const { mutate: cancelBooking, isLoading: isCancelling } = useCancelBooking();

  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(booking.id, {
        onSuccess: () => {
          setCancelMessage({ type: 'success', text: 'Booking cancelled successfully!' });
        },
        onError: (err) => {
          setCancelMessage({ type: 'error', text: err.message || 'Failed to cancel booking.' });
        },
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      {booking.hotel && (
        <Link to={`/hotels/${booking.hotel.id}`} className="text-xl font-bold text-blue-600 hover:underline mb-1">
          {booking.hotel.name}
        </Link>
      )}
      {booking.hotel && <p className="text-gray-600 text-sm mb-2">{booking.hotel.location}</p>}
      {booking.room && <p className="text-gray-700 font-semibold mb-2">Room Type: {booking.room.type}</p>}
      
      <p className="text-gray-600 text-sm mb-1">Check-in: {booking.checkInDate}</p>
      <p className="text-gray-600 text-sm mb-1">Check-out: {booking.checkOutDate}</p>
      <p className="text-gray-600 text-sm mb-1">Guests: {booking.numberOfGuests}</p>
      <p className="text-gray-600 text-sm mb-1">Total Price: <span className="font-bold text-green-700">${booking.totalPrice}</span></p>
      <p className="text-gray-600 text-sm mb-4">Status: <span className={`font-bold ${booking.status === 'confirmed' ? 'text-green-600' : 'text-red-600'}`}>{booking.status}</span></p>
      
      {cancelMessage.text && (
        <div className={`p-2 text-sm rounded-md mb-2 ${
          cancelMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {cancelMessage.text}
        </div>
      )}

      {booking.status === 'confirmed' && (
        <button
          onClick={handleCancelBooking}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 mt-auto"
          disabled={isCancelling}
        >
          {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
        </button>
      )}
    </div>
  );
};

export default BookingCard;
