const firebaseConfig = {
    apiKey: "AIzaSyDXgkwXL7ZgDs-kbn6EVo5Mn0yIy7EfVrg",
    authDomain: "exam-bece4.firebaseapp.com",
    projectId: "exam-bece4",
    storageBucket: "exam-bece4.appspot.com",
    messagingSenderId: "857661909127",
    appId: "1:857661909127:web:8a22908a7546beba31b022"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();