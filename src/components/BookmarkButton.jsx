// src/components/BookmarkButton.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import styles from './ActionButtons.module.css'; // Use the correct, dedicated stylesheet
import { Bookmark } from 'lucide-react';

function BookmarkButton({ postId }) {
  const { currentUser } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!currentUser || !postId) return;
    const userRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      setIsBookmarked(doc.data()?.readingList?.includes(postId));
    });
    return unsubscribe;
  }, [postId, currentUser]);

  const handleBookmark = async () => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.uid);
    await updateDoc(userRef, {
      readingList: isBookmarked ? arrayRemove(postId) : arrayUnion(postId)
    });
  };

  return (
    <button onClick={handleBookmark} className={`${styles.iconButton} ${isBookmarked ? styles.bookmarked : ''}`} title={isBookmarked ? 'Remove from list' : 'Add to reading list'}>
      <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
    </button>
  );
}
export default BookmarkButton;
