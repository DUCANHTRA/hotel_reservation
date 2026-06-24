import React, { useState } from 'react';
import { useHotels, useAddHotel, useUpdateHotel, useDeleteHotel } from '../../hooks/hotelHooks';
import Navbar from '../../components/Navbar';

const ManageHotelsPage = () => {
  const { data: hotels, isLoading, isError, error } = useHotels();
  const { mutate: addHotel } = useAddHotel();
  const { mutate: updateHotel } = useUpdateHotel();
  const { mutate: deleteHotel } = useDeleteHotel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    rating: '',
    images: [],
    pricePerNight: '',
  });

  const openAddModal = () => {
    setCurrentHotel(null);
    setFormData({
      name: '',
      location: '',
      description: '',
      rating: '',
      images: [],
      pricePerNight: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (hotel) => {
    setCurrentHotel(hotel);
    setFormData({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      rating: hotel.rating,
      images: hotel.images || [],
      pricePerNight: hotel.pricePerNight,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { value } = e.target;
    const images = value.split(',').map((img) => img.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, images }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const rating = parseFloat(formData.rating);
    const pricePerNight = parseFloat(formData.pricePerNight);

    if (isNaN(rating) || isNaN(pricePerNight)) {
      alert('Please enter valid numbers for rating and price per night.');
      return;
    }

    const hotelData = {
      ...formData,
      rating,
      pricePerNight,
    };

    const mutationOptions = {
      onSuccess: () => {
        closeModal();
      },
      onError: (error) => {
        alert(`Operation failed: ${error.message}`);
      }
    };

    if (currentHotel) {
      updateHotel({ hotelId: currentHotel.id, hotelData }, mutationOptions);
    } else {
      addHotel(hotelData, mutationOptions);
    }
  };

  const handleDelete = (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      deleteHotel(hotelId);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Loading...</p>
    </div>
  );
  if (isError) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Error: {error.message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-2xl md:text-3xl font-light tracking-wider text-ink">Manage Hotels</h1>
        <div className="w-12 h-px bg-ink-200 mt-4 mb-6" />
        <div className="flex justify-end mb-6">
          <button
            onClick={openAddModal}
            className="text-xs tracking-widest uppercase border border-ink-200 px-5 py-2 text-ink-300 hover:border-ink hover:text-ink transition-colors duration-300"
          >
            Add New Hotel
          </button>
        </div>

        <div className="bg-paper overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-paper-dark">
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Name</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Location</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Rating</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Price/Night</th>
                <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.id} className="border-b border-paper-dark">
                  <td className="px-6 py-4 text-sm text-ink">{hotel.name}</td>
                  <td className="px-6 py-4 text-sm text-ink-300">{hotel.location}</td>
                  <td className="px-6 py-4 text-sm text-ink-300">{hotel.rating}</td>
                  <td className="px-6 py-4 text-sm text-ink-300">${hotel.pricePerNight}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => openEditModal(hotel)}
                      className="text-xs tracking-widest uppercase text-ink-300 hover:text-ink transition-colors duration-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.id)}
                      className="text-xs tracking-widest uppercase text-ink-300 hover:text-ink transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-ink/40 overflow-y-auto flex items-center justify-center">
            <div className="bg-white p-8 w-full max-w-lg mx-4">
              <h2 className="text-sm font-bold tracking-wider uppercase text-ink mb-6">
                {currentHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                    className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300" required />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="location">Location</label>
                  <input type="text" id="location" name="location" value={formData.location} onChange={handleChange}
                    className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300" required />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="description">Description</label>
                  <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3"
                    className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300" required />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="rating">Rating (1-5)</label>
                  <input type="number" id="rating" name="rating" value={formData.rating} onChange={handleChange} min="1" max="5" step="0.1"
                    className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300" required />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="pricePerNight">Price per Night (default)</label>
                  <input type="number" id="pricePerNight" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} min="0" step="0.01"
                    className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300" required />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="images">Image URLs (comma-separated)</label>
                  <textarea id="images" name="images" value={formData.images.join(', ')} onChange={handleImageChange} rows="2"
                    className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300" />
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <button type="button" onClick={closeModal}
                    className="text-xs tracking-widest uppercase px-4 py-2 text-ink-300 hover:text-ink transition-colors duration-300">
                    Cancel
                  </button>
                  <button type="submit"
                    className="text-xs tracking-widest uppercase border border-ink-200 px-5 py-2 text-ink-300 hover:border-ink hover:text-ink transition-colors duration-300">
                    {currentHotel ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageHotelsPage;
