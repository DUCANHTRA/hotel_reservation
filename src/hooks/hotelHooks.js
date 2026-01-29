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
      queryClient.invalidateQueries(['hotel']);
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
    enabled: !!hotelId,
  });
};

export const useFilteredHotels = (filters) => {
  return useQuery({
    queryKey: ['filteredHotels', filters],
    queryFn: () => getFilteredHotels(filters),
  });
};
