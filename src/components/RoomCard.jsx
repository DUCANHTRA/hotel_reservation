import React from 'react';
import useStore from '../store/store';

const RoomCard = ({ room, onBook, checkInDate, checkOutDate }) => {
  const { user } = useStore();
  const isBookButtonDisabled = !checkInDate || !checkOutDate || !user;

  return (
    <div className="bg-paper p-5 flex flex-col">
      <h3 className="text-sm font-bold tracking-wider text-ink uppercase">{room.type}</h3>
      <p className="text-xs text-ink-300 mt-2">Capacity: {room.capacity} guests</p>
      {room.amenities && room.amenities.length > 0 && (
        <p className="text-xs text-ink-300 mt-1">{room.amenities.join(' · ')}</p>
      )}
      <div className="flex items-center mt-auto pt-4 border-t border-paper-dark">
        <span className="text-ink font-bold text-sm">${room.pricePerNight}</span>
        <span className="text-ink-200 text-xs ml-1">/ night</span>
        {user ? (
          <button
            onClick={() => onBook(room.id, room.pricePerNight, room.capacity)}
            className={`ml-auto text-xs tracking-widest uppercase px-4 py-1.5 border transition-colors duration-300 ${
              isBookButtonDisabled
                ? 'border-ink-100 text-ink-200 cursor-not-allowed'
                : 'border-ink-200 text-ink-300 hover:border-ink hover:text-ink'
            }`}
            disabled={isBookButtonDisabled}
          >
            {isBookButtonDisabled ? 'Select Dates' : 'Book Now'}
          </button>
        ) : (
          <span className="ml-auto text-xs text-ink-200">Login to book</span>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
