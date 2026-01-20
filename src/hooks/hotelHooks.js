import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { addHotel, updateHotel, deleteHotel, getHotels, getHotelById, getFilteredHotels } from '../api/hotelApi';

export const useAddHotel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addHotel,
    onSuccess: () => {
      queryClient.invalidateQueries(['hotels']);
    },
  });
};

export const useUpdateHotel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateHotel,
    onSuccess: () => {
      queryClient.invalidateQueries(['hotels']);
      queryClient.invalidateQueries(['hotel']); // Invalidate specific hotel details if open
    },
  });
};

export const useDeleteHotel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHotel,
    onSuccess: () => {
      queryClient.invalidateQueries(['hotels']);
    },
  });
};

export const useHotels = () => {
  return useQuery({
    queryKey: ['hotels'],
    queryFn: getHotels,
  });
};

export const useHotel = (hotelId) => {
  return useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => getHotelById(hotelId),
    enabled: !!hotelId, // Only run the query if hotelId is provided
  });
};

export const useFilteredHotels = (filters) => {
  return useQuery({
    queryKey: ['filteredHotels', filters],
    queryFn: () => getFilteredHotels(filters),
    // Optionally add staleTime, cacheTime etc.
  });
};
