importScripts("https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC-lEbLkQN0dic-2hPT5I4eIdGVAePwwQI",
  authDomain: "brief-me-push-notification.firebaseapp.com",
  projectId: "brief-me-push-notification",
  storageBucket: "brief-me-push-notification.firebasestorage.app",
  messagingSenderId: "1027078049719",
  appId: "1:1027078049719:web:be265669dca4d72bb52232",
  measurementId: "G-Z1FP5JSGRJ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png" // or your custom icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
