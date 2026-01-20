import React from 'react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <img
        src={hotel.images && hotel.images[0] ? hotel.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={hotel.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{hotel.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{hotel.location}</p>
      <div className="flex items-center mb-4">
        <span className="text-yellow-500 text-lg mr-1">★</span>
        <span className="text-gray-700">{hotel.rating}</span>
        <span className="ml-auto text-gray-600">Starting from ${hotel.pricePerNight}</span>
      </div>
      <Link
        to={`/hotels/${hotel.id}`}
        className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
      >
        View Details
      </Link>
    </div>
  );
};

export default HotelCard;
