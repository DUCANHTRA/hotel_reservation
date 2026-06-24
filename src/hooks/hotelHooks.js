import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { addHotel, updateHotel, deleteHotel, getHotels, getFeaturedHotels, getHotelById, getFilteredHotels } from '../api/hotelApi';

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
    staleTime: 60000,
  });
};

export const useFeaturedHotels = () => {
  return useQuery({
    queryKey: ['featuredHotels'],
    queryFn: getFeaturedHotels,
    staleTime: 120000,
  });
};

export const useHotel = (hotelId) => {
  return useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => getHotelById(hotelId),
    enabled: !!hotelId,
    staleTime: 120000,
  });
};

export const useFilteredHotels = (filters) => {
  return useQuery({
    queryKey: ['filteredHotels', filters],
    queryFn: () => getFilteredHotels(filters),
    staleTime: 30000,
  });
};
