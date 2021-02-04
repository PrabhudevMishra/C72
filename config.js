import firebase from 'firebase';
require('@firebase/firestore');



var firebaseConfig = {
    apiKey: "AIzaSyCWn-Md2DvuoffQ9CW9lxTHx2oQ5L8KTrY",
    authDomain: "wily-d98f1.firebaseapp.com",
    projectId: "wily-d98f1",
    storageBucket: "wily-d98f1.appspot.com",
    messagingSenderId: "799893669435",
    appId: "1:799893669435:web:3c2c8ba3b4b4a4905cbe1e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();