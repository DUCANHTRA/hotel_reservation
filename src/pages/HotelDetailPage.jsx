import React, { useState, useEffect } from 'react';
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
  const { user, setUser } = useStore();
  const { data: hotel, isLoading: isLoadingHotel, isError: isErrorHotel, error: errorHotel } = useHotel(id);
  const { data: rooms, isLoading: isLoadingRooms, isError: isErrorRooms, error: errorRooms } = useRooms(id);

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [minCheckOutDate, setMinCheckOutDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' }); // for success/error messages

  const { mutate: createBooking, isLoading: isBookingLoading } = useCreateBooking();


  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayString = today.toISOString().split('T')[0];
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    setCheckInDate(todayString);
    setCheckOutDate(tomorrowString);
    setMinCheckOutDate(tomorrowString);
  }, []);

  useEffect(() => {
    if (checkInDate) {
      const checkIn = new Date(checkInDate);
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayString = nextDay.toISOString().split('T')[0];
      setMinCheckOutDate(nextDayString);
      if (new Date(checkOutDate) < nextDay) {
        setCheckOutDate(nextDayString);
      }
    }
  }, [checkInDate, checkOutDate]);


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

  if (isLoadingHotel || isLoadingRooms) return <div className="text-center mt-8 text-xl">Loading details...</div>;
  if (isErrorHotel) return <div className="text-center mt-8 text-red-500 text-xl">Error: {errorHotel.message}</div>;
  if (!hotel) return <div className="text-center mt-8 text-xl">Hotel not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{hotel.name}</h1>
          <p className="text-gray-600 text-lg mb-2">{hotel.location}</p>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 text-2xl mr-1">★</span>
            <span className="text-gray-700 text-xl">{hotel.rating}</span>
          </div>
          <p className="text-gray-800 mb-6">{hotel.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {hotel.images && hotel.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${hotel.name} - ${index + 1}`}
                className="w-full h-48 object-cover rounded-md shadow"
              />
            ))}
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">Select Dates and Guests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <DatePicker
              label="Check-in Date"
              selectedDate={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              minDate={new Date().toISOString().split('T')[0]}
            />
            <DatePicker
              label="Check-out Date"
              selectedDate={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              minDate={minCheckOutDate}
            />
            <div>
              <label htmlFor="guests" className="block text-gray-700 text-sm font-bold mb-2">
                Number of Guests
              </label>
              <input
                type="number"
                id="guests"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(Math.max(1, parseInt(e.target.value)))}
                min="1"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {bookingMessage.text && (
            <div className={`p-3 rounded-md mb-4 ${
              bookingMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {bookingMessage.text}
            </div>
          )}

          <h2 className="text-3xl font-bold text-gray-800 mb-4">Available Rooms</h2>
          {isErrorRooms && <div className="text-red-500">Error loading rooms: {errorRooms.message}</div>}
          {rooms && rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <p className="text-gray-600">No rooms available for this hotel for the selected dates/guests.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HotelDetailPage;


