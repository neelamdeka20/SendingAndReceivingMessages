import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; // Import Firestore
import './AuthComponent.css';

// Initialize Firebase with your config
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

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

function AuthComponent({ signupCompleted, onUserChange, setSignupCompleted }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignUp = async () => {
    try {
      // Sign up with email and password
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      console.log('User signed up successfully');
      setError(null);

      // Add the user to Firestore
      const user = firebase.auth().currentUser;
      if (user) {
        const userData = {
          uid: user.uid || '', // You can set this during sign-up if needed
          email: user.email,
          // Add more user data fields here as needed
        };

        // Firestore reference to the 'users' collection
        const usersRef = firebase.firestore().collection('users');

        // Add the user data to Firestore
        await usersRef.doc(user.uid).set(userData);

        setSignupCompleted(true); // Set signup completed flag
        setIsLoggedIn(false); // Ensure the user is not considered logged in after signup
        onUserChange(user);
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      // Handle sign-up error
      setError(error.message);
    }
  };

  const handleLogIn = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      console.log('User signed in successfully');
      setIsLoggedIn(true);
      setError(null);
      setSignupCompleted(false); // Ensure signup completed flag is reset
      onUserChange(firebase.auth().currentUser); // Notify the parent component of the user change
    } catch (error) {
      // Handle log-in error
      setError(error.message);
    }
  };

  const handleLogOut = async () => {
    try {
      // Sign out the current user
      await firebase.auth().signOut();
      console.log('User signed out successfully');
      setIsLoggedIn(false);
      setError(null);
      setSignupCompleted(false); // Ensure signup completed flag is reset
      onUserChange(null); // Notify the parent component of the user change
    } catch (error) {
      // Handle log-out error
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {!isLoggedIn ? (
        <div>
          <button onClick={handleSignUp}>Sign Up</button>
          <button onClick={handleLogIn}>Log In</button>
        </div>
      ) : (
        <button onClick={handleLogOut}>Log Out</button>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
  
}

export default AuthComponent;
