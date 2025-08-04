// src/components/LikeButton.jsx
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import styles from './ActionButtons.module.css'; // Use the correct, dedicated stylesheet
import { Heart } from 'lucide-react';

function LikeButton({ postId }) {
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!currentUser || !postId) return;
    const postRef = doc(db, 'posts', postId);
    const unsubscribe = onSnapshot(postRef, (doc) => {
      setIsLiked(doc.data()?.likes?.includes(currentUser.uid));
    });
    return unsubscribe;
  }, [postId, currentUser]);

  const handleLike = async () => {
    if (!currentUser) return;
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      likes: isLiked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
    });
  };

  return (
    <button onClick={handleLike} className={`${styles.iconButton} ${isLiked ? styles.liked : ''}`} title={isLiked ? 'Unlike' : 'Like'}>
      <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
    </button>
  );
}
export default LikeButton;
