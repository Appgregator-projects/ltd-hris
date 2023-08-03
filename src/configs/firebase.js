// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwwWrwj2twDr-xkFG_4N2qcBLZoHnYJuE",
  authDomain: "lifetime-design-erp.firebaseapp.com",
  projectId: "lifetime-design-erp",
  storageBucket: "lifetime-design-erp.appspot.com",
  messagingSenderId: "683829372227",
  appId: "1:683829372227:web:f1612fc4497e2f2701fbf6",
  measurementId: "G-X61RSHGQWY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

export { app, db, storage, auth };