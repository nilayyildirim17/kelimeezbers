  import { initializeApp } from "firebase/app";
  import {getFirestore} from 'firebase/firestore'
  import {getAuth, initializeAuth} from 'firebase/auth'
  import { getStorage } from "firebase/storage";
  const firebaseConfig = {
    apiKey: "AIzaSyCyXA47LPiEa_gZUGqyGpCDagwK-IIewh0",
    authDomain: "odev-68012.firebaseapp.com",
    projectId: "odev-68012",
    storageBucket: "odev-68012.appspot.com",
    messagingSenderId: "93349770849",
    appId: "1:93349770849:web:966bb93e32543902e11c20",
    measurementId: "G-R4T09LLHE7"
  };
  

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app)
  const db = getFirestore(app);
  const storage = getStorage(app);

  export { firebaseConfig ,auth, db ,storage};