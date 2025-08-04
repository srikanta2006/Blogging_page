  // src/pages/ReadingListPage.jsx

  import { useState, useEffect } from 'react';
  import { db } from '../firebase/config';
  import { doc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
  import { useAuth } from '../context/AuthContext';
  import { Link } from 'react-router-dom';
  import styles from './ReadingListPage.module.css';

  function ReadingListPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    useEffect(() => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      const userDocRef = doc(db, 'users', currentUser.uid);
      const unsubscribe = onSnapshot(userDocRef, async (userDoc) => {
        if (userDoc.exists()) {
          const readingListIds = userDoc.data().readingList || [];
          if (readingListIds.length > 0) {
            const postsQuery = query(collection(db, 'posts'), where('__name__', 'in', readingListIds));
            const postSnapshots = await getDocs(postsQuery);
            const savedPosts = postSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(savedPosts);
          } else {
            setPosts([]);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }, [currentUser]);

    if (loading) return <div className="text-center py-20">Loading Reading List...</div>;

    return (
      <div>
        <header className={styles.header}>
          <h1 className={styles.title}>My Reading List</h1>
          <p className={styles.subtitle}>Articles you've saved to read later.</p>
        </header>
        
        {posts.length > 0 ? (
          <div className={styles.postList}>
            {posts.map(post => (
              <div key={post.id} className={styles.postItem}>
                <img src={`https://source.unsplash.com/random/240x240?sig=${post.id}`} alt="" className={styles.postImage} />
                <div className={styles.postDetails}>
                  <Link to={`/post/${post.id}`} className={styles.postTitle}>{post.title}</Link>
                  <div className={styles.authorInfo}>
                    <img src={post.authorProfilePic || `https://i.pravatar.cc/24?u=${post.authorId}`} alt={post.authorUsername} className={styles.authorImage} />
                    <span>{post.authorUsername}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2 className="text-xl font-bold mb-2">Your reading list is empty.</h2>
            <p className="text-gray-600">Save articles by clicking the bookmark icon.</p>
          </div>
        )}
      </div>
    );
  }

  export default ReadingListPage;
