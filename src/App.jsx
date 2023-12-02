import './App.css'
import { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage'
import Profile from './components/Profile'
import Courses from './components/Courses'

import {
  initializeApp
} from "firebase/app";
import {
  getAnalytics
} from "firebase/analytics";
import {
  getAuth,
  onAuthStateChanged
} from "firebase/auth"
import firebase from 'firebase/compat/app'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom'

function App() {
  const [user, setUser] = useState({ email: "", uid: "", name: ""});

  const firebaseConfig = {
    apiKey: "AIzaSyAoKpZpoexyJn0CTkeVaYyEo24b5X2ezmg",
    authDomain: "project-x-92081.firebaseapp.com",
    projectId: "project-x-92081",
    storageBucket: "project-x-92081.appspot.com",
    messagingSenderId: "302116065870",
    appId: "1:302116065870:web:e08f6d6c92848100ebe91f",
    measurementId: "G-P1X8M6SYEH"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const analytics = getAnalytics(app);

  /* auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL) */

  useEffect(() => {
    onAuthStateChanged(auth, (user, error) => {
      if (error) {
        console.error("Authentication error:", error);
      } else {
        if(user) {
          setUser({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            img: user.photoURL
          });
          sessionStorage.setItem('token', user.accessToken)
        } else {
          setUser(null)
        }
      }
    });
    
  }, [auth])

  return ( 
      <main>
        <Router>
          {(user && user?.email)? 
            <Routes>
              <Route path="/login" element={<Loggit ininPage auth={auth} />} />
              <Route path="/courses" element={<Courses user={user} auth={auth} />} />
              <Route path="/profile" element={<Profile user={user} auth={auth} />} />
              <Route path="*" element={<Navigate to="/courses" />} />
            </Routes>
          : <LoginPage auth={auth} / >
          }
        </Router>
      </main>
  )
}

export default App;