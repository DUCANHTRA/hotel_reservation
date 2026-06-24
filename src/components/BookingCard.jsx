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
    <div className="bg-paper p-5 flex flex-col">
      {booking.hotel && (
        <Link to={`/hotels/${booking.hotel.id}`} className="text-sm font-bold tracking-wider text-ink uppercase hover:text-ink-300 transition-colors duration-300">
          {booking.hotel.name}
        </Link>
      )}
      {booking.hotel && <p className="text-xs text-ink-300 mt-1">{booking.hotel.location}</p>}
      {booking.room && <p className="text-xs text-ink mt-2">{booking.room.type}</p>}

      <div className="mt-3 space-y-1 text-xs text-ink-300">
        <p>Check-in: {booking.checkInDate}</p>
        <p>Check-out: {booking.checkOutDate}</p>
        <p>Guests: {booking.numberOfGuests}</p>
        <p>Total: <span className="text-ink font-bold">${booking.totalPrice}</span></p>
        <p>
          Status:{' '}
          <span className={`${booking.status === 'confirmed' ? 'text-ink' : 'text-ink-200'}`}>
            {booking.status}
          </span>
        </p>
      </div>

      {cancelMessage.text && (
        <p className="text-xs text-ink-300 mt-3">{cancelMessage.text}</p>
      )}

      {booking.status === 'confirmed' && (
        <button
          onClick={handleCancelBooking}
          className="mt-4 text-xs tracking-widest uppercase border border-ink-200 px-3 py-1.5 text-ink-300 hover:border-ink hover:text-ink transition-colors duration-300 self-start"
          disabled={isCancelling}
        >
          {isCancelling ? 'Cancelling...' : 'Cancel'}
        </button>
      )}
    </div>
  );
};

export default BookingCard;
