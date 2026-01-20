import React, { useState } from 'react';
import { useHotels, useAddHotel, useUpdateHotel, useDeleteHotel } from '../../hooks/hotelHooks';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const ManageHotelsPage = () => {
  const { data: hotels, isLoading, isError, error } = useHotels();
  const { mutate: addHotel } = useAddHotel();
  const { mutate: updateHotel } = useUpdateHotel();
  const { mutate: deleteHotel } = useDeleteHotel();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null); // For editing
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    rating: '',
    images: [],
    pricePerNight: '', // Assuming a default price for new hotels
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
      images: hotel.images,
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
    setFormData((prev) => ({ ...prev, images: value.split(',').map((img) => img.trim()) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentHotel) {
      updateHotel({ hotelId: currentHotel.id, hotelData: formData });
    } else {
      addHotel(formData);
    }
    closeModal();
  };

  const handleDelete = (hotelId) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      deleteHotel(hotelId);
    }
  };

  if (isLoading) return <div className="text-center mt-8 text-xl">Loading hotels...</div>;
  if (isError) return <div className="text-center mt-8 text-red-500 text-xl">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Hotels</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Hotel
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Night
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{hotel.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hotel.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{hotel.rating}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${hotel.pricePerNight}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(hotel)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.id)}
                      className="text-red-600 hover:text-red-900"
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {currentHotel ? 'Edit Hotel' : 'Add New Hotel'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rating">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="1"
                    max="5"
                    step="0.1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pricePerNight">
                    Price per Night (default)
                  </label>
                  <input
                    type="number"
                    id="pricePerNight"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
                    Image URLs (comma-separated)
                  </label>
                  <textarea
                    id="images"
                    name="images"
                    value={formData.images.join(', ')}
                    onChange={handleImageChange}
                    rows="2"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {currentHotel ? 'Update Hotel' : 'Add Hotel'}
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
