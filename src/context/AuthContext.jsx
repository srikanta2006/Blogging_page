// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Create the context
const AuthContext = createContext();

// Create a custom hook to use the context
export function useAuth() {
  return useContext(AuthContext);
}

// Create the Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check if auth state is loaded

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    // onAuthStateChanged is a listener that runs when the user logs in or out
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Auth state has been checked
    });

    // Cleanup the listener when the component unmounts
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    logout,
  };

  // Render children only when not loading
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}