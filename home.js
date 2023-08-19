import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { doc, getFirestore, getDoc, updateDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
// import moment from 'moment'; // Import the moment library for date formatting

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCU8DerDbCjzbsZ9k4vR5aBrzB5VUJaaQE",
    authDomain: "hackathon-1f5f2.firebaseapp.com",
    databaseURL: "https://hackathon-1f5f2-default-rtdb.firebaseio.com",
    projectId: "hackathon-1f5f2",
    storageBucket: "hackathon-1f5f2.appspot.com",
    messagingSenderId: "592803092485",
    appId: "1:592803092485:web:5c124f8a7cbabcb36ee46c"
  };


// Initialize Firebase app

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Logout Button

const logoutButton = document.getElementById('logout-button');

// Add click event listener to the logout button

logoutButton.addEventListener('click', (e) => {
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            window.location = 'log.html'; // Redirect to login page after sign-out
        })
        .catch((error) => {
            // An error happened.
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
});

let user;
let userFullName;

// Listen for changes in the user's authentication state

auth.onAuthStateChanged((currentUser) => {
    user = currentUser;

    if (user) {
        const userUID = user.uid;
        console.log("User UID:", userUID);

        const userRef = doc(db, 'users', userUID);

        getDoc(userRef)
            .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                    const userData = docSnapshot.data();
                    userFullName = userData.firstName + ' ' + userData.lastName;

                    const navTextElement = document.querySelector('.nav-text');
                    navTextElement.textContent = userFullName;
                } else {
                    console.log('User data not found in Firestore.');
                }
            })
            .catch((error) => {
                console.error('Error retrieving user data:', error);
            });
    } else {
        // User is not authenticated
        console.log("User is not authenticated.");
    }
});

// Text area form validation
const textarea = document.getElementById('textarea-input');
const charCount = document.getElementById('charCount');

textarea.addEventListener('input', function () {
    const text = this.value;
    const textLength = text.length;

    if (textLength < 100) {
        this.setCustomValidity('Minimum character limit is 100');
    } else if (textLength > 3000) {
        this.value = text.slice(0, 3000);
        this.setCustomValidity('Maximum character limit is 3000');
    } else {
        this.setCustomValidity('');
    }

    charCount.textContent = `Characters remaining: ${3000 - textLength}`;
});

// Publish Blog Button

function makeBlogEditable(blogItem) {
    const blogText = blogItem.querySelector('.textareavalue');

    blogItem.querySelector('.edit-btn').addEventListener('click', () => {
        const isEditable = blogText.getAttribute('contenteditable') === 'true';
        blogText.contentEditable = !isEditable;


        const editButton = blogItem.querySelector('.edit-btn');
        editButton.textContent = isEditable ? 'Edit' : 'Save';

        
         const deletePostFunc = async (id) => {
         await deleteDoc(doc(db, "todo", id));
         };

        
        if (blogText.contentEditable) {
            blogText.style.border = '1px solid #ccc';
            blogText.style.padding = '4px';
        } else {
            blogText.style.border = 'none';
            blogText.style.padding = '0';
        }
    });

}



const publishBlog = document.getElementById('publish-blog');

// Add click event listener to the "Publish Blog" button
publishBlog.addEventListener('click', async () => {
    if (!user) {
        console.error('User is not defined');
        return;
    }

    const title = document.getElementById('title-input').value;
    const textarea = document.getElementById('textarea-input').value;

    let blogItem = document.createElement('li');
    let date = new Date();
    blogItem.className = 'list';

    if (title.trim() === '' || textarea.trim() === '') {
        alert('Both Title and Textarea are required.');
        return;
    }
    if (title.trim() === '') {
        alert('Enter Title First');
        return;
    }
    if (textarea.trim() === '') {
        alert('Enter Textarea First'); // Corrected the alert message
    }
    if (title.length < 5 || title.length > 50) {
        alert('Title should be between 5 and 50 characters');
        return;
    }
    if (textarea.length < 100) {
        alert('Blog should be at least 100 characters long');
        return;
    }
    if (textarea.length > 3000) {
        alert('Blog should not exceed 3000 characters long');
    }
    blogItem.innerHTML = `
    <div class="uploaded-blog">
        <div class="upper-sec">
            <div class="profile"><img class="img" src="abdullah pic (2).jpg"></div>
            <div class="name-sec">
                <div class="title-div">
                    <p class="title">${title}</p>
                </div>
                <p class="name-date">${userFullName} on ${moment(date).format('lll')}</p>
            </div>
        </div>
        <div class="blogpubmain">
            <p class='textareavalue' id='blog-textarea'>${textarea}</p>
        </div>
        <div class='btns'>
            <button class='edit-btn'>Edit</button>
            <button class='delete-btn'>Delete</button>
        </div>
    </div>
    `;

    const blogText = blogItem.querySelector('#blog-textarea');

    makeBlogEditable(blogItem);

    const blogList = document.getElementById('list');
    blogList.appendChild(blogItem);

    blogList.insertBefore(blogItem, blogList.firstChild);

    document.getElementById('title-input').value = '';
    document.getElementById('textarea-input').value = '';
    const collectionRef = collection(db, 'blog'); // Reference to the "blog" collection
    await addDoc(collectionRef, {
        userId: user.uid,
        title: title,
        blog: textarea,

    });
});