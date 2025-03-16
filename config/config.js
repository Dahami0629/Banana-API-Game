const firebaseConfig = {
    apiKey: "AIzaSyBQz9gSzz50FijPLyBRK5erspnQ7tmOetE",
    authDomain: "banana-api-game-bed67.firebaseapp.com",
    projectId: "banana-api-game-bed67",
    storageBucket: "banana-api-game-bed67.firebasestorage.app",
    messagingSenderId: "754732833864",
    appId: "1:754732833864:web:4feb779fb4b7a435304c7d"
  };
  

firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
const db = firebase.firestore();