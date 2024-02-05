// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-7738e.firebaseapp.com",
  projectId: "mern-estate-7738e",
  storageBucket: "mern-estate-7738e.appspot.com",
  messagingSenderId: "395039767092",
  appId: "1:395039767092:web:3fa9ba982ff7093c942861"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);