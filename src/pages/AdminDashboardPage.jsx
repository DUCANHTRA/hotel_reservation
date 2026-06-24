import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-2xl md:text-3xl font-light tracking-wider text-ink">Admin Dashboard</h1>
        <div className="w-12 h-px bg-ink-200 mt-4 mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1 bg-paper p-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-ink mb-5">Management</h2>
            <nav className="space-y-3">
              <Link to="/admin/hotels" className="block text-xs tracking-wider uppercase text-ink-300 hover:text-ink transition-colors duration-300">
                Hotels
              </Link>
              <Link to="/admin/rooms" className="block text-xs tracking-wider uppercase text-ink-300 hover:text-ink transition-colors duration-300">
                Rooms
              </Link>
              <Link to="/admin/bookings" className="block text-xs tracking-wider uppercase text-ink-300 hover:text-ink transition-colors duration-300">
                Bookings
              </Link>
              <Link to="/admin/analytics" className="block text-xs tracking-wider uppercase text-ink-300 hover:text-ink transition-colors duration-300">
                Analytics
              </Link>
            </nav>
          </aside>

          <section className="md:col-span-3 bg-paper p-8">
            <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-12">
              Select a section to manage.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
