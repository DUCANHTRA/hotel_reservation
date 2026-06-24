import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useFeaturedHotels } from '../hooks/hotelHooks';
import HotelCard from '../components/HotelCard';

const HomePage = () => {
  const { data: featuredHotels, isLoading, isError } = useFeaturedHotels();

  return (
    <div className="min-h-screen bg-white text-ink">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-ink">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/80" />
        <div className="relative z-10 text-center px-6 max-w-xl">
          <p className="text-xs tracking-[0.3em] uppercase text-white/70 mb-8">
            Traditional hospitality. Modern comfort.
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-wider text-white leading-tight">
            Find Your
            <br />
            <span className="font-bold">Quiet Stay</span>
          </h1>
          <p className="text-sm text-white/60 mt-6 leading-relaxed max-w-md mx-auto">
            Every room is a retreat. Every moment, an invitation to stillness.
          </p>
          <Link
            to="/hotels"
            className="inline-block mt-10 text-xs tracking-[0.25em] uppercase border border-white/40 px-8 py-3 text-white/80 hover:bg-white hover:text-ink transition-all duration-500"
          >
            Browse Hotels
          </Link>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-ink-300">Curated selections</p>
          <h2 className="text-2xl md:text-3xl font-light tracking-wider text-ink mt-3">
            Featured
            <span className="font-bold"> Hotels</span>
          </h2>
          <div className="w-12 h-px bg-ink-200 mt-6" />
        </div>

        {isLoading && (
          <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">
            Loading...
          </p>
        )}
        {isError && (
          <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">
            Unable to load hotels. Please try again.
          </p>
        )}
        {!isLoading && !isError && (!featuredHotels || featuredHotels.length === 0) && (
          <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">
            No featured hotels available at this time.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {featuredHotels?.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-paper px-6 py-24 md:py-32">
        <div className="max-w-readable mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-ink-300">Our ethos</p>
          <h2 className="text-2xl md:text-3xl font-light tracking-wider text-ink mt-6">
            Stillness is
            <span className="font-bold"> luxury</span>
          </h2>
          <div className="w-12 h-px bg-ink-200 mx-auto mt-6 mb-8" />
          <p className="text-sm text-ink-300 leading-relaxed">
            Inspired by the Japanese principle of <em>ma</em> — the beauty of
            negative space — we craft stays that breathe. No excess. No noise.
            Just what matters: rest, warmth, and silence.
          </p>
          <Link
            to="/hotels"
            className="inline-block mt-10 text-xs tracking-[0.25em] uppercase border border-ink-200 px-8 py-3 text-ink-300 hover:border-ink hover:text-ink transition-all duration-500"
          >
            Begin your stay
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
