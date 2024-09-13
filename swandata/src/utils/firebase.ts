import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // If using Firestore
import { getDatabase,ref,onValue} from 'firebase/database'; // If using Realtime Database

// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDQcNpR73RjnxH_SPQs_MNAnV8mB_Id-Ok",
  authDomain: "swandata-cd40f.firebaseapp.com",
  databaseURL: "https://swandata-cd40f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "swandata-cd40f",
  storageBucket: "swandata-cd40f.appspot.com",
  messagingSenderId: "783167923770",
  appId: "1:783167923770:web:484dfc9b9daab18c753703",
  measurementId: "G-XG0FPG3Z3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // If using Firestore
export const rtdb = getDatabase(app); // If using Realtime Database

