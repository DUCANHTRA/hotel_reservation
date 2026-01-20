import { db } from '../firebase/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { getRoomById } from './roomApi'; // Import getRoomById

export const createBooking = async (bookingDetails) => {
  const { roomId, checkInDate, checkOutDate, userId, totalPrice, numberOfGuests, roomCapacity } = bookingDetails;

  // Convert string dates to Firebase Timestamps
  const checkInTimestamp = Timestamp.fromDate(new Date(checkInDate));
  const checkOutTimestamp = Timestamp.fromDate(new Date(checkOutDate));

  // 1. Check for overlapping bookings
  const bookingsRef = collection(db, 'Bookings');
  const q = query(
    bookingsRef,
    where('roomId', '==', roomId),
    where('checkInDate', '<', checkOutTimestamp),
    where('checkOutDate', '>', checkInTimestamp)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    throw new Error('Room is not available for the selected dates.');
  }

  // 2. Check if number of guests exceeds room capacity
  if (numberOfGuests > roomCapacity) {
    throw new Error(`Number of guests (${numberOfGuests}) exceeds room capacity (${roomCapacity}).`);
  }

  // 3. Create the booking
  const newBooking = {
    userId,
    roomId,
    checkInDate: checkInTimestamp,
    checkOutDate: checkOutTimestamp,
    totalPrice,
    numberOfGuests, // Store number of guests for reference
    status: 'confirmed', // Default status
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(bookingsRef, newBooking);
  return { id: docRef.id, ...newBooking };
};

export const getBookingsByUserId = async (userId) => {
  const bookingsRef = collection(db, 'Bookings');
  const q = query(bookingsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const bookings = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    checkInDate: doc.data().checkInDate.toDate().toISOString().split('T')[0], // Convert Timestamp to date string
    checkOutDate: doc.data().checkOutDate.toDate().toISOString().split('T')[0], // Convert Timestamp to date string
  }));
  return bookings;
};

export const getAllBookings = async () => {
  const bookingsRef = collection(db, 'Bookings');
  const querySnapshot = await getDocs(bookingsRef);
  const bookings = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    checkInDate: doc.data().checkInDate.toDate().toISOString().split('T')[0],
    checkOutDate: doc.data().checkOutDate.toDate().toISOString().split('T')[0],
    createdAt: doc.data().createdAt?.toDate().toISOString(), // Include createdAt for analytics
  }));
  return bookings;
};

export const updateBookingStatus = async (bookingId, newStatus) => {
  const bookingDocRef = doc(db, 'Bookings', bookingId);
  await updateDoc(bookingDocRef, { status: newStatus });
  return { id: bookingId, status: newStatus };
};

export const cancelBooking = async (bookingId) => {
  return updateBookingStatus(bookingId, 'cancelled');
};

export const getBookingsOverTime = async () => {
  const bookingsRef = collection(db, 'Bookings');
  const querySnapshot = await getDocs(bookingsRef);
  const bookings = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate().toISOString(),
  }));
  return bookings;
};

export const getMostBookedHotels = async () => {
  const bookingsRef = collection(db, 'Bookings');
  const querySnapshot = await getDocs(bookingsRef);
  const bookingsWithHotelIdPromises = querySnapshot.docs.map(async (docSnapshot) => {
    const bookingData = { id: docSnapshot.id, ...docSnapshot.data() };
    const room = await getRoomById(bookingData.roomId);
    return {
      ...bookingData,
      hotelId: room ? room.hotelId : null,
    };
  });
  return Promise.all(bookingsWithHotelIdPromises);
};
