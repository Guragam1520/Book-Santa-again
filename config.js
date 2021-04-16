 import firebase from 'firebase'
 require("@firebase/firestore")
 
 const firebaseConfig = {
    apiKey: "AIzaSyCE7YD7F2cRRGOWwNExED3PGwa2_Ij7pOg",
    authDomain: "book-santa-73a89.firebaseapp.com",
    projectId: "book-santa-73a89",
    storageBucket: "book-santa-73a89.appspot.com",
    messagingSenderId: "501990639438",
    appId: "1:501990639438:web:64ea3044e5cf7a42f9c01f"
  };
if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

  export default firebase.firestore();