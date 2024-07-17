import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCB20PBV3R-khprcNTcw5EZLD6l9UyfLbA",
    authDomain: "mapproject-56854.firebaseapp.com",
    projectId: "mapproject-56854",
    storageBucket: "mapproject-56854.appspot.com",
    messagingSenderId: "742278043723",
    appId: "1:742278043723:web:bbcb5793160fbc915ad5ce"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
