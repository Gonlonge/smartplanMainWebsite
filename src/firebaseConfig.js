// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCEEILE5ZcnQsRZkSu2WXrLWwwSAQQqHUg",
    authDomain: "gl-project-test.firebaseapp.com",
    databaseURL:
        "https://gl-project-test-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "gl-project-test",
    storageBucket: "gl-project-test.appspot.com",
    messagingSenderId: "249410728176",
    appId: "1:249410728176:web:1e29894704fc0b82559235",
    measurementId: "G-4EM308S86S",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
