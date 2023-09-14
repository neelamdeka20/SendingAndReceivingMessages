import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import './Chat.css';

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
const firestore = firebase.firestore();

export default function Chat() {
  const [sentMessages, setSentMessages] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [error, setError] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const messagesRef = firestore.collection('messages');

      const unsubscribe = messagesRef
        .orderBy('timestamp', 'desc')
        .onSnapshot(async (querySnapshot) => {
          const sentMessageData = [];
          const receivedMessageData = [];

          for (const doc of querySnapshot.docs) {
            const message = doc.data();
            const senderEmail = await getUserEmail(message.senderUid);
            const recipientEmail = await getUserEmail(message.recipientUid);

            if (message.senderUid === user.uid) {
              sentMessageData.push({
                id: doc.id,
                text: message.text,
                senderEmail: senderEmail,
                recipientEmail: recipientEmail,
              });
            } else if (message.recipientUid === user.uid) {
              receivedMessageData.push({
                id: doc.id,
                text: message.text,
                senderEmail: senderEmail,
                recipientEmail: recipientEmail,
              });
            }
          }

          setSentMessages(sentMessageData);
          setReceivedMessages(receivedMessageData);
        });

      return () => unsubscribe();
    }
  }, [user, firestore]);

  const sendMessage = async () => {
    try {
      if (!user) {
        setError('Please log in to send a message.');
        return;
      }

      if (newMessage.trim() === '' || recipientEmail.trim() === '') {
        setError('Please enter a message and recipient email.');
        return;
      }

      const recipientUid = await getRecipientUid(recipientEmail);

      if (recipientUid) {
        const messageData = {
          text: newMessage,
          senderUid: user.uid,
          recipientUid: recipientUid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };

        await firestore.collection('messages').add(messageData);
        setNewMessage('');
        setError(null);
      } else {
        setError('Recipient not found.');
      }
    } catch (error) {
      setError('Error sending message. Please try again.');
    }
  };

  async function getUserEmail(uid) {
    try {
      const userDoc = await firestore.collection('users').doc(uid).get();
      if (userDoc.exists) {
        return userDoc.data().email;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error getting user email:', error);
      return null;
    }
  }

  async function getRecipientUid(recipientEmail) {
    try {
      const usersRef = firestore.collection('users');
      const query = usersRef.where('email', '==', recipientEmail).limit(1);
      const querySnapshot = await query.get();
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return userDoc.id;
      } else {
        throw new Error('Recipient user not found');
      }
    } catch (error) {
      console.error('Error getting recipient UID:', error);
      setError('Error getting recipient UID. Please try again.');
      return null;
    }
  }

  return (
    <div className="chat-container">
      {user ? (
        <>
          <div className="sent-messages">
            <h3>Sent Messages</h3>
            {sentMessages.map((message) => (
              <div key={message.id} className="message">
                <p>Recipient: {message.recipientEmail} " {message.text} "</p>
              </div>
            ))}
          </div>
          <div className="received-messages">
            <h3>Received Messages</h3>
            {receivedMessages.map((message) => (
              <div key={message.id} className="message">
                <p>Sender: {message.senderEmail} " {message.text} "</p>
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text1"
              placeholder="Recipient's Email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <input
              type="text2"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      ) : (
        <div className="unauthenticated-message">
          Please log in to access the chat.
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
