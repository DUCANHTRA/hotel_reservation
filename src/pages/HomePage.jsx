import React from 'react';
import Navbar from '../components/Navbar';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">Welcome to the Hotel Reservation System</h1>
        <p className="text-lg text-center text-gray-600 mt-4">Browse and book your perfect stay.</p>
      </main>
    </div>
  );
};

export default HomePage;
