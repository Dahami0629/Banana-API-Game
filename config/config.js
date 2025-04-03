const firebaseConfig = {
  apiKey: "AIzaSyDdkVQykQ3onKpSkcCe6wHiBLrFO-DiYtc",
  authDomain: "banana-api-new-game.firebaseapp.com",
  projectId: "banana-api-new-game",
  storageBucket: "banana-api-new-game.firebasestorage.app",
  messagingSenderId: "243512714827",
  appId: "1:243512714827:web:6d6fbea27944a14ec54fce"
  };
  

firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const db = firebase.firestore();