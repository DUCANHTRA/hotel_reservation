import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmailAndPassword } from '../firebase/firebase';
import useStore from '../store/store';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userObject = await loginWithEmailAndPassword(email, password);
      setUser(userObject);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center -mt-16 min-h-screen">
        <div className="w-full max-w-sm px-6">
          <h2 className="text-2xl font-light tracking-wider text-ink text-center">Login</h2>
          <div className="w-8 h-px bg-ink-200 mx-auto mt-4 mb-10" />
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink placeholder:text-ink-200 text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink placeholder:text-ink-200 text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300"
              />
            </div>
            <button
              type="submit"
              className="w-full text-xs tracking-widest uppercase border border-ink-200 px-6 py-3 text-ink-300 hover:border-ink hover:text-ink transition-colors duration-300"
            >
              Login
            </button>
          </form>
          {error && <p className="text-xs text-ink-300 text-center mt-6">{error}</p>}
          <p className="text-xs text-ink-300 text-center mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-ink hover:text-ink-300 underline underline-offset-2">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
