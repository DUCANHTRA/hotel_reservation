import { db, auth } from '../firebase/firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

const requireAuth = () => {
  if (!auth || !auth.currentUser) {
    const err = new Error('User not authenticated. Sign in before performing this operation.');
    err.code = 'auth/not-authenticated';
    throw err;
  }
};

export const getHotels = async () => {
  try {
    const hotelsCollectionRef = collection(db, 'Hotels');
    const querySnapshot = await getDocs(hotelsCollectionRef);
    const hotels = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return hotels;
  } catch (error) {
    console.error('getHotels error:', error);
    // If Firestore denies permission, return empty list so UI can show a friendly state
    if (error?.code === 'permission-denied' || /Missing or insufficient permissions/.test(error.message)) {
      return [];
    }
    throw error;
  }
};

export const getHotelById = async (hotelId) => {
  try {
    const hotelDocRef = doc(db, 'Hotels', hotelId);
    const hotelDoc = await getDoc(hotelDocRef);
    if (hotelDoc.exists()) {
      return { id: hotelDoc.id, ...hotelDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('getHotelById error:', error);
    if (error?.code === 'permission-denied' || /Missing or insufficient permissions/.test(error.message)) {
      return null;
    }
    throw error;
  }
};

export const addHotel = async (hotelData) => {
  try {
    requireAuth();
    const hotelsCollectionRef = collection(db, 'Hotels');
    const docRef = await addDoc(hotelsCollectionRef, {
      ...hotelData,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...hotelData };
  } catch (error) {
    console.error('addHotel error:', error);
    throw error;
  }
};

export const updateHotel = async ({ hotelId, hotelData }) => {
  try {
    requireAuth();
    if (!hotelId) {
      throw new Error("updateHotel requires a hotelId.");
    }
    const hotelDocRef = doc(db, 'Hotels', hotelId);
    await updateDoc(hotelDocRef, hotelData);
    return { id: hotelId, ...hotelData };
  } catch (error) {
    console.error('updateHotel error:', error);
    throw error;
  }
};

export const deleteHotel = async (hotelId) => {
  try {
    requireAuth();
    const hotelDocRef = doc(db, 'Hotels', hotelId);
    await deleteDoc(hotelDocRef);
    return hotelId;
  } catch (error) {
    console.error('deleteHotel error:', error);
    throw error;
  }
};

export const getFilteredHotels = async (filters) => {
  try {
    const hotelsCollectionRef = collection(db, 'Hotels');
    let q = query(hotelsCollectionRef);

    const { location, minRating, minPrice, maxPrice } = filters || {};
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
  } catch (error) {
    console.error('getFilteredHotels error:', error);
    if (error?.code === 'permission-denied' || /Missing or insufficient permissions/.test(error.message)) {
      return [];
    }
    throw error;
  }
};
