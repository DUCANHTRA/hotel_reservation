import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-8 mt-16">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Hotel Booking. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="hover:text-blue-400">Privacy Policy</a>
          <a href="#" className="hover:text-blue-400">Terms of Service</a>
          <a href="#" className="hover:text-blue-400">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
