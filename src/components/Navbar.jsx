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
    <header className="sticky top-0 z-50 bg-white border-b border-paper-dark">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-sm font-bold tracking-widest uppercase text-ink">
          Ryokan
        </Link>
        <div className="flex items-center gap-8 text-xs uppercase tracking-widest text-ink-300">
          <Link to="/" className="hover:text-ink transition-colors duration-300">Home</Link>
          <Link to="/hotels" className="hover:text-ink transition-colors duration-300">Hotels</Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className="hover:text-ink transition-colors duration-300">Admin</Link>
          )}
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-ink transition-colors duration-300">Dashboard</Link>
              <button
                onClick={handleLogout}
                className="hover:text-ink transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-ink transition-colors duration-300">Login</Link>
              <Link
                to="/register"
                className="border border-ink-200 px-4 py-1.5 hover:border-ink transition-colors duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
