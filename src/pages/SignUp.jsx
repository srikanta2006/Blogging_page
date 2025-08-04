// src/pages/SignUp.jsx

import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css'; // Use the same shared stylesheet

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        bio: '',
        profilePictureURL: `https://i.pravatar.cc/150?u=${user.uid}`,
        followers: [],
        following: [],
        createdAt: serverTimestamp(),
      });
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
          following: [],
          createdAt: serverTimestamp(),
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
          <h1 className={styles.title}>Create an Account</h1>
          <p className={styles.subtitle}>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>Log In</Link>
          </p>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSignUp} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
            />
          </div>
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
          <button type="submit" className={styles.submitButton}>Create Account</button>
        </form>

        <div className={styles.divider}>OR</div>

        <button onClick={handleGoogleSignIn} className={styles.socialButton}>
          <svg className={styles.socialIcon} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Google</title><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 1.98-4.66 1.98-3.57 0-6.45-2.84-6.45-6.32s2.88-6.32 6.45-6.32c2.03 0 3.36.79 4.29 1.72l2.6-2.58C18.07 1.72 15.64 0 12.48 0 5.88 0 0 5.58 0 12s5.88 12 12.48 12c6.92 0 12.08-4.79 12.08-12.26 0-.8-.08-1.55-.2-2.32H12.48z"/></svg>
          Sign Up with Google
        </button>
      </div>
    </div>
  );
}

export default SignUp;
