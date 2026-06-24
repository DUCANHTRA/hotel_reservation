import React, { useState, useEffect } from 'react';
import { useFilteredHotels } from '../hooks/hotelHooks';
import HotelCard from '../components/HotelCard';
import Navbar from '../components/Navbar';

const HotelListingPage = () => {
  const [filters, setFilters] = useState({
    location: '',
    minRating: '',
    minPrice: '',
    maxPrice: '',
  });
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const { data: hotels, isLoading, isError, error } = useFilteredHotels(debouncedFilters);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-2xl md:text-3xl font-light tracking-wider text-ink">Available Hotels</h1>
        <div className="w-12 h-px bg-ink-200 mt-4 mb-10" />

        <div className="bg-paper p-8 mb-12">
          <p className="text-xs tracking-[0.25em] uppercase text-ink-300 mb-5">Filter</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label htmlFor="location" className="block text-xs tracking-wider uppercase text-ink-300 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink placeholder:text-ink-200 text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300"
                placeholder="e.g., New York"
              />
            </div>
            <div>
              <label htmlFor="minRating" className="block text-xs tracking-wider uppercase text-ink-300 mb-2">
                Min Rating
              </label>
              <select
                id="minRating"
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300"
              >
                <option value="">Any</option>
                <option value="1">1 Star +</option>
                <option value="2">2 Stars +</option>
                <option value="3">3 Stars +</option>
                <option value="4">4 Stars +</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <div>
              <label htmlFor="minPrice" className="block text-xs tracking-wider uppercase text-ink-300 mb-2">
                Min Price
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink placeholder:text-ink-200 text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300"
                placeholder="e.g., 50"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-xs tracking-wider uppercase text-ink-300 mb-2">
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink placeholder:text-ink-200 text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300"
                placeholder="e.g., 200"
              />
            </div>
          </div>
        </div>

        {isLoading && <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-12">Loading...</p>}
        {isError && <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-12">Error: {error.message}</p>}

        {hotels && hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-12">No hotels found matching your criteria.</p>
        )}
      </main>
    </div>
  );
};

export default HotelListingPage;
