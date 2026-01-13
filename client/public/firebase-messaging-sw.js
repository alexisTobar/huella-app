// client/public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDP_Dj7maSfY5Oc_baRxwqSJwraDLH72Ws",
  authDomain: "talahuellas-ca02c.firebaseapp.com",
  projectId: "talahuellas-ca02c",
  storageBucket: "talahuellas-ca02c.firebasestorage.app",
  messagingSenderId: "695812104989",
  appId: "1:695812104989:web:ae66200d7bcb312a90f7f4"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Esto es lo que hace que aparezca la notificación cuando el usuario no está viendo la web
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Recibida notificación en segundo plano ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png' // O la URL de tu logo de TalaHuellas
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});