// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this

const firebaseConfig = {
  apiKey: "AIzaSyBM1eRePcuFcd5dt8kMC-JMvWrtHzud9Cg",
  authDomain: "factoryisland-92052.firebaseapp.com",
  projectId: "factoryisland-92052",
  storageBucket: "factoryisland-92052.appspot.com",
  messagingSenderId: "221092067778",
  appId: "1:221092067778:web:20b4d8df55a28c431dfe5b",
  measurementId: "G-GW53R9YC14"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Initialize storage

let analytics;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});

export { app, auth, db, storage }; // ✅ Export storage here
export default app;
export { analytics };
