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
  appId: "1:683829372227:web:40fd151188de595e01fbf6",
  measurementId: "G-N53JXQN2CG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

export { app, db, storage, auth };
