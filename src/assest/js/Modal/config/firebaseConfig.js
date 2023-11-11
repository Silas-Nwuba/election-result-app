// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDnhK081nwSPOBTshTMHE7mufskGOx0z_g',
  authDomain: 'inecviewpotal.firebaseapp.com',
  databaseURL: 'https://inecviewpotal-default-rtdb.firebaseio.com',
  projectId: 'inecviewpotal',
  storageBucket: 'inecviewpotal.appspot.com',
  messagingSenderId: '254914103308',
  appId: '1:254914103308:web:e9aa6b352bbaa4b0718629',
  measurementId: 'G-7YEMVSKW2Y',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const auth = getAuth(app);
