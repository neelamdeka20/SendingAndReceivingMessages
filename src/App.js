// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Chat from './Chat'; // Import the Chat component
// import firebase from './firebase'; // Import Firebase
import Authentication from './authentication';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [signupCompleted, setSignupCompleted] = useState(false);
  const [user, setUser] = useState(null);
  
  const handleUserChange = (newUser) => {
    setUser(newUser);
  };

  return (
    <div className="App">
      <h1>My Chat App</h1>
      <div className="left-column">
        <Authentication
          signupCompleted={signupCompleted}
          onUserChange={handleUserChange}
          setSignupCompleted={setSignupCompleted}
        />
      </div>
      <br />
      <div className="right-column">
        <ErrorBoundary>
        {user && !signupCompleted && (
          <Chat user={user} />
        )}
        </ErrorBoundary>
        </div>
    </div>
  );
}

export default App;
