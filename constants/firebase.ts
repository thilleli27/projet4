import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDP4vybtcmA4PbF2jl6eJdUiCy9k27z1ss",
  authDomain: "localstreet-e2839.firebaseapp.com",
  projectId: "localstreet-e2839",
  storageBucket: "localstreet-e2839.firebasestorage.app",
  messagingSenderId: "950608344792",
  appId: "1:950608344792:web:b85aec5cd86c425fb409ad"
};

const app = initializeApp(firebaseConfig);

// Auth avec persistance de session ✅
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
export const storage = getStorage(app);