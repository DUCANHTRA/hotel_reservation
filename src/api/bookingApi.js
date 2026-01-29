import { db } from '../firebase/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { getRoomById } from './roomApi'; 

export const createBooking = async (bookingDetails) => {
  const { roomId, checkInDate, checkOutDate, userId, totalPrice, numberOfGuests, roomCapacity } = bookingDetails;


  const checkInTimestamp = Timestamp.fromDate(new Date(checkInDate));
  const checkOutTimestamp = Timestamp.fromDate(new Date(checkOutDate));

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


  if (numberOfGuests > roomCapacity) {
    throw new Error(`Number of guests (${numberOfGuests}) exceeds room capacity (${roomCapacity}).`);
  }

 
  const newBooking = {
    userId,
    roomId,
    checkInDate: checkInTimestamp,
    checkOutDate: checkOutTimestamp,
    totalPrice,
    numberOfGuests, 
    status: 'confirmed',
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
    checkInDate: doc.data().checkInDate.toDate().toISOString().split('T')[0],
    checkOutDate: doc.data().checkOutDate.toDate().toISOString().split('T')[0], 
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
    createdAt: doc.data().createdAt?.toDate().toISOString(), 
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
