importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");
firebase.initializeApp({
  apiKey: "AIzaSyBr_drU2L3wndWce7i2Pjtpepuwc_VnAzY",
  authDomain: "wordle-d7fab.firebaseapp.com",
  projectId: "wordle-d7fab",
  messagingSenderId: "1048912631015",
  appId: "1:1048912631015:web:f389f317c49a4eeb89be42",
});
firebase.messaging().onBackgroundMessage((p) => {
  self.registration.showNotification(p.data.title, {
    body: p.data.body,
    icon: "wordle-icon.png",
  });
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => (list.length ? list[0].focus() : clients.openWindow("./")))
  );
});