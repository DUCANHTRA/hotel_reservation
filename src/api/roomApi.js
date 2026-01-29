import { db } from '../firebase/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const getRoomsByHotelId = async (hotelId) => {
  const roomsCollectionRef = collection(db, 'Rooms');
  const q = query(roomsCollectionRef, where('hotelId', '==', hotelId));
  const querySnapshot = await getDocs(q);
  const rooms = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return rooms;
};

export const getRoomById = async (roomId) => {
  const roomDocRef = doc(db, 'Rooms', roomId);
  const roomDoc = await getDoc(roomDocRef);
  if (roomDoc.exists()) {
    return { id: roomDoc.id, ...roomDoc.data() };
  } else {
    return null;
  }
};

export const addRoom = async (roomData) => {
  const roomsCollectionRef = collection(db, 'Rooms');
  const docRef = await addDoc(roomsCollectionRef, {
    ...roomData,
    createdAt: new Date(),
  });
  return { id: docRef.id, ...roomData };
};

export const updateRoom = async ({ roomId, roomData }) => {
  try {
    if (!roomId) {
      throw new Error("updateRoom requires a roomId.");
    }
    const roomDocRef = doc(db, 'Rooms', roomId);
    await updateDoc(roomDocRef, roomData);
    return { id: roomId, ...roomData };
  } catch (error) {
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  const roomDocRef = doc(db, 'Rooms', roomId);
  await deleteDoc(roomDocRef);
  return roomId;
};
