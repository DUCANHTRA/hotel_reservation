import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { addRoom, updateRoom, deleteRoom, getRoomsByHotelId } from '../api/roomApi';

export const useAddRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRoom,
    onSuccess: (newRoom) => {
      queryClient.invalidateQueries(['rooms', newRoom.hotelId]);
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRoom,
    onSuccess: (updatedRoom) => {
      queryClient.invalidateQueries(['rooms', updatedRoom.hotelId]);
      queryClient.invalidateQueries(['room', updatedRoom.id]);
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: (deletedRoomId, variables) => {
      queryClient.invalidateQueries(['rooms']);
    },
  });
};

export const useRooms = (hotelId) => {
  return useQuery({
    queryKey: ['rooms', hotelId],
    queryFn: () => getRoomsByHotelId(hotelId),
    enabled: !!hotelId,
  });
};
