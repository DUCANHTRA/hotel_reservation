import React, { useState } from 'react';
import { useRooms, useAddRoom, useUpdateRoom, useDeleteRoom } from '../../hooks/roomHooks';
import { useHotels } from '../../hooks/hotelHooks';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

const ManageRoomsPage = () => {
  const { data: hotels, isLoading: isLoadingHotels, isError: isErrorHotels, error: errorHotels } = useHotels();

  const [selectedHotelId, setSelectedHotelId] = useState('');
  const { data: rooms, isLoading: isLoadingRooms, isError: isErrorRooms, error: errorRooms } = useRooms(selectedHotelId);

  const { mutate: addRoom } = useAddRoom();
  const { mutate: updateRoom } = useUpdateRoom();
  const { mutate: deleteRoom } = useDeleteRoom();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null); // For editing
  const [formData, setFormData] = useState({
    hotelId: selectedHotelId,
    type: '',
    pricePerNight: '',
    capacity: '',
    amenities: [],
  });

  const openAddModal = () => {
    setCurrentRoom(null);
    setFormData({
      hotelId: selectedHotelId,
      type: '',
      pricePerNight: '',
      capacity: '',
      amenities: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (room) => {
    setCurrentRoom(room);
    setFormData({
      hotelId: room.hotelId,
      type: room.type,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      amenities: room.amenities || [],
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

  const handleAmenitiesChange = (e) => {
    const { value } = e.target;
    const amenities = value.split(',').map((a) => a.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, amenities }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const capacity = parseInt(formData.capacity, 10);
    const pricePerNight = parseFloat(formData.pricePerNight);

    if (isNaN(capacity) || isNaN(pricePerNight)) {
      alert('Please enter valid numbers for capacity and price per night.');
      return;
    }

    const roomData = {
      ...formData,
      capacity,
      pricePerNight,
    };
    
    const mutationOptions = {
      onSuccess: () => {
        closeModal();
      },
      onError: (error) => {
        alert(`Operation failed: ${error.message}`);
        console.error("Mutation failed:", error);
      }
    };

    if (currentRoom) {
      console.log("Submitting room update:", { roomId: currentRoom.id, roomData });
      updateRoom({ roomId: currentRoom.id, roomData }, mutationOptions);
    } else {
      console.log("Submitting new room:", roomData);
      addRoom(roomData, mutationOptions);
    }
  };

  const handleDelete = (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      deleteRoom(roomId);
    }
  };

  if (isLoadingHotels || isLoadingRooms) return <div className="text-center mt-8 text-xl">Loading...</div>;
  if (isErrorHotels) return <div className="text-center mt-8 text-red-500 text-xl">Error loading hotels: {errorHotels.message}</div>;
  if (isErrorRooms) return <div className="text-center mt-8 text-red-500 text-xl">Error loading rooms: {errorRooms.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto p-4 mt-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Manage Rooms</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <label htmlFor="hotel-select" className="block text-gray-700 text-sm font-bold mb-2">
            Select Hotel to Manage Rooms:
          </label>
          <select
            id="hotel-select"
            value={selectedHotelId}
            onChange={(e) => setSelectedHotelId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a Hotel --</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name} ({hotel.location})
              </option>
            ))}
          </select>
        </div>

        {selectedHotelId && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={openAddModal}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add New Room
              </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price/Night
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amenities
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <tr key={room.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{room.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{room.capacity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${room.pricePerNight}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{room.amenities.join(', ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditModal(room)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                        No rooms found for this hotel.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {currentRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                    Room Type
                  </label>
                  <input
                    type="text"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">
                    Capacity
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="pricePerNight">
                    Price per Night
                  </label>
                  <input
                    type="number"
                    id="pricePerNight"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amenities">
                    Amenities (comma-separated)
                  </label>
                  <textarea
                    id="amenities"
                    name="amenities"
                    value={formData.amenities.join(', ')}
                    onChange={handleAmenitiesChange}
                    rows="2"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:focus:ring-blue-500"
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
                    {currentRoom ? 'Update Room' : 'Add Room'}
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

export default ManageRoomsPage;
