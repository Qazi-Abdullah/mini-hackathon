import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCU8DerDbCjzbsZ9k4vR5aBrzB5VUJaaQE",
    authDomain: "hackathon-1f5f2.firebaseapp.com",
    databaseURL: "https://hackathon-1f5f2-default-rtdb.firebaseio.com",
    projectId: "hackathon-1f5f2",
    storageBucket: "hackathon-1f5f2.appspot.com",
    messagingSenderId: "592803092485",
    appId: "1:592803092485:web:5c124f8a7cbabcb36ee46c"
  };



 
  const app = initializeApp(firebaseConfig);
  const signupform = document.querySelector(".signupform")
  signupform.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = document.querySelector(".get-Email").value
    const password = document.querySelector(".get-Password").value
    const auth = getAuth();
   createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    alert("signup successfully")
    location.assign("home.html")
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
    alert("error")
  });

  } )
