



// // 
// import { initializeApp, getApps } from "firebase/app";
// import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyBdF7MpUI_Z5O8Vn3mJF0zOiB9OQVWfN0M",
//   authDomain: "smartwater-1603f.firebaseapp.com",
//   projectId: "smartwater-1603f",
//   storageBucket: "smartwater-1603f.appspot.com",
//   messagingSenderId: "1035527975317",
//   appId: "1:1035527975317:web:d3d231cb5fc853b843069c",
//   databaseURL: "https://water-c2989-default-rtdb.asia-southeast1.firebasedatabase.app",
// };

// // Initialize Firebase once
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// // Export Realtime Database instance
// export const rtdb = getDatabase(app);


import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DB_URL,
};

const app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export const rtdb = getDatabase(app);