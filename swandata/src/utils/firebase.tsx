import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();
