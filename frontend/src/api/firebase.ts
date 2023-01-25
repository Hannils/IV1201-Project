// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZUJ4hMymuQXnmxKkq65QZ-MVJKk68KCc",
  authDomain: "iv1201-project.firebaseapp.com",
  projectId: "iv1201-project",
  storageBucket: "iv1201-project.appspot.com",
  messagingSenderId: "742609451147",
  appId: "1:742609451147:web:e46d2b0122fd61407c3c8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
