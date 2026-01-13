// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDP_Dj7maSfY5Oc_baRxwqSJwraDLH72Ws",
  authDomain: "talahuellas-ca02c.firebaseapp.com",
  projectId: "talahuellas-ca02c",
  storageBucket: "talahuellas-ca02c.firebasestorage.app",
  messagingSenderId: "695812104989",
  appId: "1:695812104989:web:ae66200d7bcb312a90f7f4"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const solicitarPermisos = async () => {
  try {
    const permiso = await Notification.requestPermission();
    if (permiso === "granted") {
      const token = await getToken(messaging, { 
        vapidKey: "BP6UKCjyYy0IJyhmrsHWCp4PIIIvVz0Xq2CyQvnMCyJC1i-Y_xzhp-qIhiQMZXkBR5XE6o-NqvqTjejI2yuSl5E" 
      });
      if (token) {
        return token;
      }
    }
  } catch (error) {
    console.error("Error al obtener token:", error);
  }
};

export const alRecibirMensaje = (callback) => onMessage(messaging, callback);