import { useQuery } from '@tanstack/react-query';
import { getBookingsOverTime, getMostBookedHotels, getAllBookings } from '../api/bookingApi';
import { getTotalUsers } from '../api/userApi';
import { getHotels } from '../api/hotelApi';
import { getRoomsByHotelId, getRoomById } from '../api/roomApi'; // Import getRoomById

export const useBookingsOverTime = () => {
  return useQuery({
    queryKey: ['bookingsOverTime'],
    queryFn: async () => {
      const bookings = await getBookingsOverTime();
      // Process bookings to aggregate data by date
      const data = {};
      bookings.forEach(booking => {
        const date = booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : 'unknown';
        data[date] = (data[date] || 0) + 1;
      });
      return Object.keys(data).sort().map(date => ({ date, count: data[date] }));
    },
  });
};

export const useMostBookedHotels = () => {
  return useQuery({
    queryKey: ['mostBookedHotels'],
    queryFn: async () => {
      const bookings = await getMostBookedHotels();
      const hotelCounts = {};
      bookings.forEach(booking => {
        if (booking.hotelId) {
          hotelCounts[booking.hotelId] = (hotelCounts[booking.hotelId] || 0) + 1;
        }
      });

      const hotels = await getHotels();
      const hotelNames = hotels.reduce((acc, hotel) => {
        acc[hotel.id] = hotel.name;
        return acc;
      }, {});

      return Object.keys(hotelCounts)
        .sort((a, b) => hotelCounts[b] - hotelCounts[a])
        .map(hotelId => ({
          hotelName: hotelNames[hotelId] || `Unknown Hotel (${hotelId})`,
          count: hotelCounts[hotelId],
        }));
    },
  });
};

export const useTotalUsers = () => {
  return useQuery({
    queryKey: ['totalUsers'],
    queryFn: getTotalUsers,
  });
};

export const useTotalBookings = () => {
  return useQuery({
    queryKey: ['totalBookings'],
    queryFn: async () => {
      const bookings = await getAllBookings();
      return bookings.length;
    },
  });
};

export const useOccupancyPerHotel = () => {
  return useQuery({
    queryKey: ['occupancyPerHotel'],
    queryFn: async () => {
      const hotels = await getHotels();
      const allBookings = await getAllBookings();
      
      const bookingsWithHotelIdPromises = allBookings.map(async (booking) => {
        const room = await getRoomById(booking.roomId);
        return {
          ...booking,
          hotelId: room ? room.hotelId : null,
        };
      });
      const enrichedBookings = await Promise.all(bookingsWithHotelIdPromises);

      const occupancyData = {};

      for (const hotel of hotels) {
        occupancyData[hotel.id] = {
          name: hotel.name,
          totalRooms: 0,
          bookedRooms: 0,
        };

        const rooms = await getRoomsByHotelId(hotel.id);
        occupancyData[hotel.id].totalRooms = rooms.length;

        const hotelBookings = enrichedBookings.filter(booking => 
            booking.hotelId === hotel.id
        );
        occupancyData[hotel.id].bookedRooms = hotelBookings.length; // Simplified for now, real occupancy needs date range
      }

      return Object.values(occupancyData).map(data => ({
        hotelName: data.name,
        occupancy: data.totalRooms > 0 ? (data.bookedRooms / data.totalRooms) * 100 : 0,
      }));
    },
  });
};
