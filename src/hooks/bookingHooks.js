import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createBooking, getBookingsByUserId, getAllBookings, updateBookingStatus, cancelBooking } from '../api/bookingApi';
import { getHotelById } from '../api/hotelApi';
import { getRoomById } from '../api/roomApi';
import { getUserData } from '../firebase/firebase'; // Import getUserData

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['userBookings']);
      queryClient.invalidateQueries(['allBookings']); // Invalidate for admin view
    },
  });
};

export const useUserBookings = (userId) => {
  return useQuery({
    queryKey: ['userBookings', userId],
    queryFn: async () => {
      const bookings = await getBookingsByUserId(userId);

      const enrichedBookingsPromises = bookings.map(async (booking) => {
        const room = await getRoomById(booking.roomId);
        let hotel = null;
        if (room && room.hotelId) {
          hotel = await getHotelById(room.hotelId);
        }
        return {
          ...booking,
          hotel,
          room,
        };
      });

      return Promise.all(enrichedBookingsPromises);
    },
    enabled: !!userId,
  });
};

export const useAllBookings = () => {
  return useQuery({
    queryKey: ['allBookings'],
    queryFn: async () => {
      const bookings = await getAllBookings();
      const enrichedBookingsPromises = bookings.map(async (booking) => {
        const room = await getRoomById(booking.roomId);
        let hotel = null;
        if (room && room.hotelId) {
          hotel = await getHotelById(room.hotelId);
        }
        const user = await getUserData(booking.userId); // Fetch user data
        return {
          ...booking,
          hotel,
          room,
          user, // Include user data
        };
      });
      return Promise.all(enrichedBookingsPromises);
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, status }) => updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['allBookings']);
      queryClient.invalidateQueries(['userBookings']); // Invalidate user view if needed
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['userBookings']);
      queryClient.invalidateQueries(['allBookings']);
    },
  });
};
