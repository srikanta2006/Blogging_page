// src/components/FollowButton.jsx

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import styles from './FollowButton.module.css'; // Import the new stylesheet

function FollowButton({ profileUserId }) {
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', currentUser.uid), (doc) => {
      setIsFollowing(doc.data()?.following?.includes(profileUserId));
    });
    return () => unsub();
  }, [currentUser, profileUserId]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      alert('You must be logged in to follow users.');
      return;
    }
    const currentUserRef = doc(db, 'users', currentUser.uid);
    const profileUserRef = doc(db, 'users', profileUserId);

    if (isFollowing) {
      await updateDoc(currentUserRef, { following: arrayRemove(profileUserId) });
      await updateDoc(profileUserRef, { followers: arrayRemove(currentUser.uid) });
    } else {
      await updateDoc(currentUserRef, { following: arrayUnion(profileUserId) });
      await updateDoc(profileUserRef, { followers: arrayUnion(currentUser.uid) });
    }
  };
  
  if (!currentUser || currentUser.uid === profileUserId) {
    return null;
  }

  return (
    <button 
      onClick={handleFollowToggle} 
      className={`${styles.button} ${isFollowing ? styles.unfollowButton : styles.followButton}`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}

export default FollowButton;
