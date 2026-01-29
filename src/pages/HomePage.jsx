import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useHotels } from '../hooks/hotelHooks';
import HotelCard from '../components/HotelCard';

const HomePage = () => {
  const { data: hotels, isLoading, isError } = useHotels();

  const featuredHotels = hotels?.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-20">
        <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}></div>
        <div className="relative z-10">
            <h1 className="text-5xl font-extrabold">Find Your Perfect Stay</h1>
            <p className="text-xl mt-4 mb-8">Book from thousands of hotels worldwide.</p>
            <Link to="/hotels" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition duration-300">
                Browse Hotels
            </Link>
        </div>
      </section>

      <main className="container mx-auto p-4 mt-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Featured Hotels</h2>
        {isLoading && <p className="text-center">Loading hotels...</p>}
        {isError && <p className="text-center text-red-500">Error fetching hotels.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHotels?.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
