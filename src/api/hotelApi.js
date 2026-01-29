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

export const updateHotel = async ({ hotelId, hotelData }) => {
  try {
    if (!hotelId) {
      throw new Error("updateHotel requires a hotelId.");
    }
    const hotelDocRef = doc(db, 'Hotels', hotelId);
    await updateDoc(hotelDocRef, hotelData);
    return { id: hotelId, ...hotelData };
  } catch (error) {
    throw error;
  }
};

export const deleteHotel = async (hotelId) => {
  const hotelDocRef = doc(db, 'Hotels', hotelId);
  await deleteDoc(hotelDocRef);
  return hotelId;
};

export const getFilteredHotels = async (filters) => {
  const hotelsCollectionRef = collection(db, 'Hotels');
  let q = query(hotelsCollectionRef);

  const { location, minRating, minPrice, maxPrice } = filters;
  let clientSideFilters = [];

  if (location) {
    q = query(q, where('location', '>=', location), where('location', '<=', location + '\uf8ff'));
    if (minPrice) clientSideFilters.push(hotel => hotel.pricePerNight >= parseFloat(minPrice));
    if (maxPrice) clientSideFilters.push(hotel => hotel.pricePerNight <= parseFloat(maxPrice));
    if (minRating) clientSideFilters.push(hotel => hotel.rating >= parseFloat(minRating));
  } else if (minPrice || maxPrice) {
    if (minPrice) q = query(q, where('pricePerNight', '>=', parseFloat(minPrice)));
    if (maxPrice) q = query(q, where('pricePerNight', '<=', parseFloat(maxPrice)));
    if (minRating) clientSideFilters.push(hotel => hotel.rating >= parseFloat(minRating));
  } else if (minRating) {
    q = query(q, where('rating', '>=', parseFloat(minRating)));
  }

  const querySnapshot = await getDocs(q);
  let hotels = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (clientSideFilters.length > 0) {
    hotels = hotels.filter(hotel => clientSideFilters.every(fn => fn(hotel)));
  }

  return hotels;
};
