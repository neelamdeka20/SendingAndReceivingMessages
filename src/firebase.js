import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBjkwfTCSD6xlVIHFO-g4Zrr9j2H4l8b70",
  authDomain: "my-react-app-b6c9e.firebaseapp.com",
  databaseURL: "https://my-react-app-b6c9e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-react-app-b6c9e",
  storageBucket: "my-react-app-b6c9e.appspot.com",
  messagingSenderId: "780663650375",
  appId: "1:780663650375:web:052f957f0534a2f4f6d962",
  measurementId: "G-Q9GX58856M"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // You might want to add additional error handling here, such as displaying a user-friendly error message.
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const db = firebase.database();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp();

export default firebaseConfig;