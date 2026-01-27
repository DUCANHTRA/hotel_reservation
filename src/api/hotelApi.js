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
    // console.log("Attempting to update hotel:", hotelId, "with data:", hotelData);
    if (!hotelId) {
      throw new Error("updateHotel requires a hotelId.");
    }
    const hotelDocRef = doc(db, 'Hotels', hotelId);
    await updateDoc(hotelDocRef, hotelData);
    // console.log("Hotel updated successfully:", hotelId);
    return { id: hotelId, ...hotelData };
  } catch (error) {
    // console.error("Error updating hotel in API:", error);
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
  let clientSideRatingFilter = false;
  let ratingValue = 0; // Default or parsed value for client-side filtering

  if (location) {
    q = query(q, where('location', '==', location));
  }

  // Apply price filters first, as they are often more selective
  if (minPrice) {
    q = query(q, where('pricePerNight', '>=', parseFloat(minPrice)));
  }
  if (maxPrice) {
    q = query(q, where('pricePerNight', '<=', parseFloat(maxPrice)));
  }

  // If a minRating is present, and we already have price range filters,
  // we must apply rating filter client-side to avoid Firestore's multi-range query limitation.
  if (minRating) {
    if (minPrice || maxPrice) {
      clientSideRatingFilter = true;
      ratingValue = parseFloat(minRating);
    } else {
      // No price filters, so we can apply rating filter directly to Firestore query
      q = query(q, where('rating', '>=', parseFloat(minRating)));
    }
  }

  const querySnapshot = await getDocs(q);
  let hotels = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Apply client-side rating filter if needed
  if (clientSideRatingFilter) {
    hotels = hotels.filter(hotel => hotel.rating >= ratingValue);
  }

  return hotels;
};
