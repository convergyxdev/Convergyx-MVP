// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBIgnKZn4rznvJimZDDJxB2rFCOxKZN4iQ",
  authDomain: "convergyx-mvp.firebaseapp.com",
  projectId: "convergyx-mvp",
  storageBucket: "convergyx-mvp.firebasestorage.app",
  messagingSenderId: "796952922966",
  appId: "1:796952922966:web:00149d0af12559ae0724f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Sign in function
export function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert(`Welcome, ${user.displayName}!`);
      // You can redirect to dashboard or store user info here
      window.location.href = "dashboard.html"; // change to your dashboard page
    })
    .catch((error) => {
      console.error("Login failed", error);
      alert("Login failed: " + error.message);
    });
}
