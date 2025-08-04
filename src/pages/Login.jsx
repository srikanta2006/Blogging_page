// src/pages/Login.jsx

import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css'; // Import the shared CSS Module

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          username: user.displayName,
          email: user.email,
          bio: '',
          profilePictureURL: user.photoURL,
          followers: [],
          following: []
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Don't have an account?{' '}
            <Link to="/signup" className={styles.link}>Sign Up</Link>
          </p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Log In</button>
        </form>

        <div className={styles.divider}>OR</div>

        <button onClick={handleGoogleSignIn} className={styles.socialButton}>
          <svg className={styles.socialIcon} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 1.98-4.66 1.98-3.57 0-6.45-2.84-6.45-6.32s2.88-6.32 6.45-6.32c2.03 0 3.36.79 4.29 1.72l2.6-2.58C18.07 1.72 15.64 0 12.48 0 5.88 0 0 5.58 0 12s5.88 12 12.48 12c6.92 0 12.08-4.79 12.08-12.26 0-.8-.08-1.55-.2-2.32H12.48z"/></svg>
          Sign In with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
