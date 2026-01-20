import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Admin Sidebar */}
          <aside className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Management</h2>
            <nav>
              <ul>
                <li className="mb-2">
                  <Link to="/admin/hotels" className="text-blue-600 hover:text-blue-800 text-lg">Manage Hotels</Link>
                </li>
                <li className="mb-2">
                  <Link to="/admin/rooms" className="text-blue-600 hover:text-blue-800 text-lg">Manage Rooms</Link>
                </li>
                <li className="mb-2">
                  <Link to="/admin/bookings" className="text-blue-600 hover:text-blue-800 text-lg">Manage Bookings</Link>
                </li>
                <li className="mb-2">
                  <Link to="/admin/analytics" className="text-blue-600 hover:text-blue-800 text-lg">Analytics</Link>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <section className="md:col-span-3 bg-white p-8 rounded-lg shadow-lg text-center">
            <p className="text-xl text-gray-700">Select an option from the sidebar to manage the system.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
