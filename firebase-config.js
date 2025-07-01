// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js ";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js ";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js ";

// Firebase yapılandırma
const firebaseConfig = {
  apiKey: "AIzaSyC0ULuda8dWAtiBTvz0WyaHe3fcRO0WrWI",
  authDomain: "sevgili-takip-5fa16.firebaseapp.com",
  projectId: "sevgili-takip-5fa16",
  storageBucket: "sevgili-takip-5fa16.firebasestorage.app",
  messagingSenderId: "147634239096",
  appId: "1:147634239096:web:b16e15aed753981dd3df8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

// Bildirim izni ve FCM token alma
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    getToken(messaging, { vapidKey: "BCB53azZLobhJPd3lxeaZ0gsqPJl0-t46Ga2NUxB9RiG0osetriqt37BXjcHOz3BX5vQG9TztqOCVstZeUBa54Y" }).then((currentToken) => {
      console.log('FCM Token:', currentToken);
    }).catch((err) => {
      console.error('Token alınırken hata oluştu:', err);
    });
  }
});

// Gelen bildirimi dinle
onMessage(messaging, (payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'notification-icon.png'
  };

  if (Notification.permission === "granted") {
    new Notification(notificationTitle, notificationOptions);
  }
});

export { db, collection, addDoc, onSnapshot, query, where };
