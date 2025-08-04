// src/components/CommentSection.jsx

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './CommentSection.module.css';

function CommentSection({ postId, postAuthorId, postTitle }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const commentsQuery = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      // THE FIX IS HERE: We now save the user's photoURL with the comment
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        text: newComment,
        authorId: currentUser.uid,
        authorUsername: currentUser.displayName || currentUser.email,
        authorProfilePic: currentUser.photoURL || '', // This line is new
        createdAt: serverTimestamp()
      });
      setNewComment('');

      // Create notification for the post author
      if (postAuthorId !== currentUser.uid) {
        const notificationRef = collection(db, 'users', postAuthorId, 'notifications');
        await addDoc(notificationRef, {
          type: 'comment',
          fromUser: currentUser.displayName || currentUser.email,
          postId: postId,
          postTitle: postTitle,
          read: false,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  return (
    <div className={styles.commentSection}>
      <h2 className={styles.commentHeader}>Join the Conversation</h2>
      {currentUser ? (
        <form onSubmit={handleAddComment} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a thoughtful comment..."
            rows="4"
            className={styles.commentTextarea}
            required
          />
          <button type="submit" className={styles.commentSubmitButton}>Post Comment</button>
        </form>
      ) : (
        <p>You must be <Link to="/login" className="text-blue-600 hover:underline font-semibold">logged in</Link> to comment.</p>
      )}
      <div className={styles.commentList}>
        {comments.map(comment => (
          <div key={comment.id} className={styles.comment}>
            {/* THE FIX IS HERE: We use the saved photoURL, with a fallback */}
            <img 
              src={comment.authorProfilePic || `https://i.pravatar.cc/40?u=${comment.authorId}`} 
              alt={comment.authorUsername} 
              className={styles.commentAuthorImage} 
            />
            <div className={styles.commentBody}>
              <p>
                <strong className={styles.commentAuthorName}>{comment.authorUsername}</strong>
                <span className={styles.commentDate}>{new Date(comment.createdAt?.toDate()).toLocaleDateString()}</span>
              </p>
              <p className={styles.commentText}>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
