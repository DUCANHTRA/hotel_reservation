import React from 'react';
import useStore from '../store/store';

const RoomCard = ({ room, onBook, checkInDate, checkOutDate }) => {
  const { user } = useStore();
  const isBookButtonDisabled = !checkInDate || !checkOutDate || !user;

  return (
    <div className="bg-gray-50 rounded-lg shadow p-4 flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{room.type}</h3>
      <p className="text-gray-600 text-sm mb-2">Capacity: {room.capacity}</p>
      <p className="text-gray-600 text-sm mb-2">Amenities: {room.amenities ? room.amenities.join(', ') : 'None'}</p>
      <div className="flex items-center mt-auto pt-2 border-t border-gray-200">
        <span className="text-blue-600 font-bold text-lg">${room.pricePerNight}</span>
        <span className="text-gray-500 text-sm ml-1">/ night</span>
        {user ? (
          <button
            onClick={() => onBook(room.id, room.pricePerNight, room.capacity)}
            className={`ml-auto px-4 py-2 rounded text-white ${
              isBookButtonDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={isBookButtonDisabled}
          >
            {isBookButtonDisabled ? 'Select Dates/Login' : 'Book Now'}
          </button>
        ) : (
          <span className="ml-auto text-sm text-gray-500">Login to book</span>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
