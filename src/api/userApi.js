import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const getTotalUsers = async () => {
  const usersCollectionRef = collection(db, 'Users');
  const querySnapshot = await getDocs(usersCollectionRef);
  return querySnapshot.size;
};

export const getUsers = async () => {
  const usersCollectionRef = collection(db, 'Users');
  const querySnapshot = await getDocs(usersCollectionRef);
  const users = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return users;
};
