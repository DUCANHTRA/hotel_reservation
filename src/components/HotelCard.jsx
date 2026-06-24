import React from 'react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  const image = hotel.images && hotel.images[0]
    ? hotel.images[0]
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3';

  return (
    <article className="group bg-paper">
      <div className="overflow-hidden">
        <img
          src={image}
          alt={hotel.name}
          className="w-full h-56 object-cover transition duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="pt-5 pb-2">
        <h3 className="text-sm font-bold tracking-wider text-ink uppercase">
          {hotel.name}
        </h3>
        <p className="text-xs text-ink-300 mt-1.5 tracking-wide">{hotel.location}</p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-paper-dark">
          <span className="text-xs text-ink-300 tracking-wider">
            {hotel.rating}
            <span className="ml-1">·</span>
          </span>
          <span className="text-xs text-ink-300 tracking-wider">
            From <span className="text-ink font-bold">${hotel.pricePerNight}</span>
            <span className="text-ink-200"> / night</span>
          </span>
        </div>
        <Link
          to={`/hotels/${hotel.id}`}
          className="block w-full text-center text-xs tracking-widest uppercase mt-5 py-2 border border-ink-200 text-ink-300 hover:border-ink hover:text-ink transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </article>
  );
};

export default HotelCard;
