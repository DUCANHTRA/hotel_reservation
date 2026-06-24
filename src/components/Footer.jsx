import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-ink-400 text-ink-50 px-6 py-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <p className="text-xs tracking-widest uppercase font-bold text-ink-50">Ryokan</p>
          <p className="text-xs text-ink-200 mt-2 max-w-readable">
            A place of quietude. Every stay is an encounter with simplicity and intention.
          </p>
        </div>
        <div className="flex gap-8 text-xs tracking-wider uppercase text-ink-200">
          <a href="#" className="hover:text-ink-50 transition-colors duration-300">Privacy</a>
          <a href="#" className="hover:text-ink-50 transition-colors duration-300">Terms</a>
          <a href="#" className="hover:text-ink-50 transition-colors duration-300">Contact</a>
        </div>
        <p className="text-xs text-ink-200">
          &copy; {new Date().getFullYear()} Ryokan. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
