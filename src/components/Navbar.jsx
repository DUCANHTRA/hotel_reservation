import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/store';
import { logout } from '../firebase/firebase';

const Navbar = () => {
  const { user, setUser } = useStore();

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <header className="bg-white shadow p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">Hotel Booking</Link>
        <div className="space-x-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/hotels" className="text-gray-600 hover:text-blue-600">Hotels</Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className="text-gray-600 hover:text-blue-600">Admin</Link>
          )}
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
