import { db, auth } from '../firebase/firebase';
import { collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const requireAuth = () => {
  if (!auth || !auth.currentUser) {
    const err = new Error('User not authenticated. Sign in before performing this operation.');
    err.code = 'auth/not-authenticated';
    throw err;
  }
};

export const getRoomsByHotelId = async (hotelId) => {
  try {
    const roomsCollectionRef = collection(db, 'Rooms');
    const q = query(roomsCollectionRef, where('hotelId', '==', hotelId));
    const querySnapshot = await getDocs(q);
    const rooms = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return rooms;
  } catch (error) {
    // Log a concise message and return safe fallback so UI can render gracefully
    console.warn('getRoomsByHotelId read failed:', error?.code || error?.message || error);
    return [];
  }
};

export const getRoomById = async (roomId) => {
  try {
    const roomDocRef = doc(db, 'Rooms', roomId);
    const roomDoc = await getDoc(roomDocRef);
    if (roomDoc.exists()) {
      return { id: roomDoc.id, ...roomDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.warn('getRoomById read failed:', error?.code || error?.message || error);
    return null;
  }
};

export const addRoom = async (roomData) => {
  try {
    requireAuth();
    const roomsCollectionRef = collection(db, 'Rooms');
    const docRef = await addDoc(roomsCollectionRef, {
      ...roomData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...roomData };
  } catch (error) {
    console.error('addRoom error:', error);
    throw error;
  }
};

export const updateRoom = async ({ roomId, roomData }) => {
  try {
    requireAuth();
    if (!roomId) {
      throw new Error("updateRoom requires a roomId.");
    }
    const roomDocRef = doc(db, 'Rooms', roomId);
    await updateDoc(roomDocRef, roomData);
    return { id: roomId, ...roomData };
  } catch (error) {
    console.error('updateRoom error:', error);
    throw error;
  }
};

export const deleteRoom = async (roomId) => {
  try {
    requireAuth();
    const roomDocRef = doc(db, 'Rooms', roomId);
    await deleteDoc(roomDocRef);
    return roomId;
  } catch (error) {
    console.error('deleteRoom error:', error);
    throw error;
  }
};
