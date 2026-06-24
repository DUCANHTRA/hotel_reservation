import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useStore from '../store/store';
import { useHotel } from '../hooks/hotelHooks';
import { useRooms } from '../hooks/roomHooks';
import RoomCard from '../components/RoomCard';
import DatePicker from '../components/DatePicker';
import { useCreateBooking } from '../hooks/bookingHooks';
import Navbar from '../components/Navbar';

const HotelDetailPage = () => {
  const { id } = useParams();
  const { user } = useStore();
  const { data: hotel, isLoading: isLoadingHotel, isError: isErrorHotel, error: errorHotel } = useHotel(id);
  const { data: rooms, isLoading: isLoadingRooms, isError: isErrorRooms, error: errorRooms } = useRooms(id);

  const getDateStrings = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return {
      todayString: today.toISOString().split('T')[0],
      tomorrowString: tomorrow.toISOString().split('T')[0],
    };
  };

  const [checkInDate, setCheckInDate] = useState(() => getDateStrings().todayString);
  const [checkOutDate, setCheckOutDate] = useState(() => getDateStrings().tomorrowString);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

  const { mutate: createBooking } = useCreateBooking();

  const minCheckOutDate = useMemo(() => {
    if (checkInDate) {
      const checkIn = new Date(checkInDate);
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split('T')[0];
    }
    return '';
  }, [checkInDate]);

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckInDate(newCheckIn);
    if (checkOutDate && new Date(checkOutDate) <= new Date(newCheckIn)) {
      const nextDay = new Date(newCheckIn);
      nextDay.setDate(nextDay.getDate() + 1);
      setCheckOutDate(nextDay.toISOString().split('T')[0]);
    }
  };

  const handleBookRoom = (roomId, pricePerNight, roomCapacity) => {
    if (!user) {
      setBookingMessage({ type: 'error', text: 'You must be logged in to book a room.' });
      return;
    }
    if (!checkInDate || !checkOutDate) {
      setBookingMessage({ type: 'error', text: 'Please select both check-in and check-out dates.' });
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const totalPrice = diffDays * pricePerNight;

    const bookingDetails = {
      roomId,
      checkInDate,
      checkOutDate,
      userId: user.uid,
      totalPrice,
      numberOfGuests,
      roomCapacity,
    };

    createBooking(bookingDetails, {
      onSuccess: () => {
        setBookingMessage({ type: 'success', text: 'Room booked successfully!' });
      },
      onError: (err) => {
        setBookingMessage({ type: 'error', text: err.message || 'Failed to book room.' });
      },
    });
  };

  if (isLoadingHotel || isLoadingRooms) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Loading...</p>
    </div>
  );
  if (isErrorHotel) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Error: {errorHotel.message}</p>
    </div>
  );
  if (!hotel) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Hotel not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="bg-paper p-8 md:p-12">
          <p className="text-xs tracking-[0.25em] uppercase text-ink-300">{hotel.location}</p>
          <h1 className="text-2xl md:text-3xl font-light tracking-wider text-ink mt-2">{hotel.name}</h1>
          <div className="flex items-center mt-3">
            <span className="text-xs text-ink-300 tracking-wider">{hotel.rating}</span>
            <span className="mx-2 text-ink-200">·</span>
          </div>
          <p className="text-sm text-ink-300 mt-4 leading-relaxed max-w-readable">{hotel.description}</p>

          {hotel.images && hotel.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {hotel.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${hotel.name} - ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              ))}
            </div>
          )}

          <div className="mt-12">
            <h2 className="text-sm font-bold tracking-wider uppercase text-ink">Book Your Stay</h2>
            <div className="w-8 h-px bg-ink-200 mt-3 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DatePicker
                label="Check-in"
                selectedDate={checkInDate}
                onChange={handleCheckInChange}
                minDate={new Date().toISOString().split('T')[0]}
              />
              <DatePicker
                label="Check-out"
                selectedDate={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                minDate={minCheckOutDate}
              />
              <div>
                <label htmlFor="guests" className="block text-xs tracking-wider uppercase text-ink-300 mb-2">
                  Guests
                </label>
                <input
                  type="number"
                  id="guests"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(Math.max(1, parseInt(e.target.value)))}
                  min="1"
                  className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300"
                />
              </div>
            </div>
          </div>

          {bookingMessage.text && (
            <p className="text-xs text-ink-300 mt-6">{bookingMessage.text}</p>
          )}

          <div className="mt-12">
            <h2 className="text-sm font-bold tracking-wider uppercase text-ink">Available Rooms</h2>
            <div className="w-8 h-px bg-ink-200 mt-3 mb-6" />
            {isErrorRooms && <p className="text-xs text-ink-300">Error loading rooms: {errorRooms.message}</p>}
            {rooms && rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onBook={handleBookRoom}
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    numberOfGuests={numberOfGuests}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs tracking-widest uppercase text-ink-300">No rooms available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HotelDetailPage;
