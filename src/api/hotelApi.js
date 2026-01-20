import { db } from '../firebase/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

export const getHotels = async () => {
  const hotelsCollectionRef = collection(db, 'Hotels');
  const querySnapshot = await getDocs(hotelsCollectionRef);
  const hotels = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return hotels;
};

export const getHotelById = async (hotelId) => {
  const hotelDocRef = doc(db, 'Hotels', hotelId);
  const hotelDoc = await getDoc(hotelDocRef);
  if (hotelDoc.exists()) {
    return { id: hotelDoc.id, ...hotelDoc.data() };
  } else {
    return null;
  }
};

export const addHotel = async (hotelData) => {
  const hotelsCollectionRef = collection(db, 'Hotels');
  const docRef = await addDoc(hotelsCollectionRef, {
    ...hotelData,
    createdAt: new Date(),
  });
  return { id: docRef.id, ...hotelData };
};

export const updateHotel = async (hotelId, hotelData) => {
  const hotelDocRef = doc(db, 'Hotels', hotelId);
  await updateDoc(hotelDocRef, hotelData);
  return { id: hotelId, ...hotelData };
};

export const deleteHotel = async (hotelId) => {
  const hotelDocRef = doc(db, 'Hotels', hotelId);
  await deleteDoc(hotelDocRef);
  return hotelId;
};

export const getFilteredHotels = async (filters) => {
  const hotelsCollectionRef = collection(db, 'Hotels');
  let q = query(hotelsCollectionRef);

  if (filters.location) {
    q = query(q, where('location', '==', filters.location));
  }
  if (filters.minRating) {
    q = query(q, where('rating', '>=', parseFloat(filters.minRating)));
  }
  if (filters.minPrice) {
    q = query(q, where('pricePerNight', '>=', parseFloat(filters.minPrice)));
  }
  if (filters.maxPrice) {
    q = query(q, where('pricePerNight', '<=', parseFloat(filters.maxPrice)));
  }

  const querySnapshot = await getDocs(q);
  const hotels = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return hotels;
};
