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
    }, 780); // 500ms debounce delay

    return () => {
      clearTimeout(timer);
    };
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) return <div className="text-center mt-8 text-xl">Loading hotels...</div>;
  if (isError) return <div className="text-center mt-8 text-red-500 text-xl">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Available Hotels</h1>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., New York"
              />
            </div>
            <div>
              <label htmlFor="minRating" className="block text-gray-700 text-sm font-bold mb-2">
                Min Rating
              </label>
              <select
                id="minRating"
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label htmlFor="minPrice" className="block text-gray-700 text-sm font-bold mb-2">
                Min Price
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 50"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-gray-700 text-sm font-bold mb-2">
                Max Price
              </label>
              <input
                type="number"
id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 200"
              />
            </div>
          </div>
        </div>

        {/* Hotel List */}
        {hotels && hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-xl">No hotels found matching your criteria.</p>
        )}
      </main>
    </div>
  );
};

export default HotelListingPage;
