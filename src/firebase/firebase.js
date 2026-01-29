// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const getUserData = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, 'Users', uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const registerWithEmailAndPassword = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, 'Users', user.uid), {
    uid: user.uid,
    name: name,
    email: user.email,
    role: 'guest',
    createdAt: new Date(),
  });
  const userData = await getUserData(user.uid);
  return { user, ...userData };
};

export const loginWithEmailAndPassword = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const userData = await getUserData(user.uid);
  return { user, ...userData };
};

export const logout = () => {
  return signOut(auth);
};

