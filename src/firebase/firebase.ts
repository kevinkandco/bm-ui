import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC-lEbLkQN0dic-2hPT5I4eIdGVAePwwQI",
  authDomain: "brief-me-push-notification.firebaseapp.com",
  projectId: "brief-me-push-notification",
  storageBucket: "brief-me-push-notification.firebasestorage.app",
  messagingSenderId: "1027078049719",
  appId: "1:1027078049719:web:be265669dca4d72bb52232",
  measurementId: "G-Z1FP5JSGRJ"
};

const app = initializeApp(firebaseConfig);

let messaging: ReturnType<typeof getMessaging> | null = null;

isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app);
  }
});

export { app, messaging, getToken, onMessage };
