
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
const auth = getAuth();
const db = getFirestore(app);



const loginform = document.getElementById('loginform');
loginform.addEventListener('click', async (e) => {
    var userEmail = document.getElementById('email').value;
    var userPassword = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
        const user = userCredential.user;
        const dt = new Date();

        // last login ke yime ko firebase mein dalo


        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            lastLogin: dt
        });

        console.log("Last login timestamp updated successfully");
        // window.location.href=''
        // jaise hi user login ho main mein bhejdo

        window.location.href = 'home.html';
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    }
});