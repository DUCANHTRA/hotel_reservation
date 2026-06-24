import React, { useState } from 'react';
import { useRooms, useAddRoom, useUpdateRoom, useDeleteRoom } from '../../hooks/roomHooks';
import { useHotels } from '../../hooks/hotelHooks';
import Navbar from '../../components/Navbar';

const ManageRoomsPage = () => {
  const { data: hotels, isLoading: isLoadingHotels, isError: isErrorHotels, error: errorHotels } = useHotels();

  const [selectedHotelId, setSelectedHotelId] = useState('');
  const { data: rooms, isLoading: isLoadingRooms, isError: isErrorRooms, error: errorRooms } = useRooms(selectedHotelId);

  const { mutate: addRoom } = useAddRoom();
  const { mutate: updateRoom } = useUpdateRoom();
  const { mutate: deleteRoom } = useDeleteRoom();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
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
      }
    };

    if (currentRoom) {
      updateRoom({ roomId: currentRoom.id, roomData }, mutationOptions);
    } else {
      addRoom(roomData, mutationOptions);
    }
  };

  const handleDelete = (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      deleteRoom(roomId);
    }
  };

  if (isLoadingHotels || isLoadingRooms) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Loading...</p>
    </div>
  );
  if (isErrorHotels) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Error: {errorHotels.message}</p>
    </div>
  );
  if (isErrorRooms) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <p className="text-xs tracking-widest uppercase text-ink-300 text-center py-20">Error: {errorRooms.message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <h1 className="text-2xl md:text-3xl font-light tracking-wider text-ink">Manage Rooms</h1>
        <div className="w-12 h-px bg-ink-200 mt-4 mb-6" />

        <div className="bg-paper p-6 mb-6">
          <label htmlFor="hotel-select" className="block text-xs tracking-wider uppercase text-ink-300 mb-2">
            Select Hotel
          </label>
          <select
            id="hotel-select"
            value={selectedHotelId}
            onChange={(e) => setSelectedHotelId(e.target.value)}
            className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300"
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
            <div className="flex justify-end mb-6">
              <button
                onClick={openAddModal}
                className="text-xs tracking-widest uppercase border border-ink-200 px-5 py-2 text-ink-300 hover:border-ink hover:text-ink transition-colors duration-300"
              >
                Add New Room
              </button>
            </div>

            <div className="bg-paper overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-paper-dark">
                    <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Type</th>
                    <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Capacity</th>
                    <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Price/Night</th>
                    <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Amenities</th>
                    <th className="px-6 py-4 text-left text-xs tracking-wider uppercase text-ink-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <tr key={room.id} className="border-b border-paper-dark">
                        <td className="px-6 py-4 text-sm text-ink">{room.type}</td>
                        <td className="px-6 py-4 text-sm text-ink-300">{room.capacity}</td>
                        <td className="px-6 py-4 text-sm text-ink-300">${room.pricePerNight}</td>
                        <td className="px-6 py-4 text-sm text-ink-300">{room.amenities.join(', ')}</td>
                        <td className="px-6 py-4 text-sm">
                          <button onClick={() => openEditModal(room)}
                            className="text-xs tracking-widest uppercase text-ink-300 hover:text-ink transition-colors duration-300 mr-4">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(room.id)}
                            className="text-xs tracking-widest uppercase text-ink-300 hover:text-ink transition-colors duration-300">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-xs tracking-widest uppercase text-ink-300 text-center">No rooms found for this hotel.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-ink/40 overflow-y-auto flex items-center justify-center">
            <div className="bg-white p-8 w-full max-w-lg mx-4">
              <h2 className="text-sm font-bold tracking-wider uppercase text-ink mb-6">
                {currentRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="type">Room Type</label>
                  <input type="text" id="type" name="type" value={formData.type} onChange={handleChange}
                    className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300" required />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="capacity">Capacity</label>
                  <input type="number" id="capacity" name="capacity" value={formData.capacity} onChange={handleChange} min="1"
                    className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300" required />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="pricePerNight">Price per Night</label>
                  <input type="number" id="pricePerNight" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} min="0" step="0.01"
                    className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300" required />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-ink-300 mb-2" htmlFor="amenities">Amenities (comma-separated)</label>
                  <textarea id="amenities" name="amenities" value={formData.amenities.join(', ')} onChange={handleAmenitiesChange} rows="2"
                    className="w-full py-2 px-0 border-b border-ink-100 bg-transparent text-ink text-sm focus:outline-none focus:border-ink-300 transition-colors duration-300" />
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <button type="button" onClick={closeModal}
                    className="text-xs tracking-widest uppercase px-4 py-2 text-ink-300 hover:text-ink transition-colors duration-300">
                    Cancel
                  </button>
                  <button type="submit"
                    className="text-xs tracking-widest uppercase border border-ink-200 px-5 py-2 text-ink-300 hover:border-ink hover:text-ink transition-colors duration-300">
                    {currentRoom ? 'Update' : 'Add'}
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
