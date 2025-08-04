// src/pages/Dashboard.jsx

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp, getCountFromServer } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import { Edit2, Trash2, Eye, Heart, MessageSquare, Send } from 'lucide-react';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    const postsQuery = query(collection(db, 'posts'), where('authorId', '==', currentUser.uid));
    
    const unsubscribe = onSnapshot(postsQuery, async (snapshot) => {
      let userPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      userPosts.sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
      setPosts(userPosts);

      const counts = {};
      for (const post of userPosts) {
        if (post.status === 'published') {
          const commentsCol = collection(db, 'posts', post.id, 'comments');
          const commentsSnapshot = await getCountFromServer(commentsCol);
          counts[post.id] = commentsSnapshot.data().count;
        }
      }
      setCommentCounts(counts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deleteDoc(doc(db, 'posts', postId));
    }
  };

  const handlePublish = async (postId) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      status: 'published',
      publishedAt: serverTimestamp()
    });
  };

  const drafts = posts.filter(p => p.status === 'draft').length;
  const published = posts.filter(p => p.status === 'published').length;

  if (loading) return <div className="text-center py-20">Loading Dashboard...</div>;

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>My Dashboard</h1>
      </header>

      {/* The stat cards are now restored */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Posts</p>
          <p className={styles.statValue}>{posts.length}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Published</p>
          <p className={styles.statValue}>{published}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Drafts</p>
          <p className={styles.statValue}>{drafts}</p>
        </div>
      </div>

      <section className={styles.postsSection}>
        <div className={styles.postsHeader}>
          <h2 className={styles.postsTitle}>Your Content</h2>
          <Link to="/create-post" className={styles.createButton}>Create New Post</Link>
        </div>
        <div className={styles.postList}>
          {posts.map(post => (
            <div key={post.id} className={styles.postRow}>
              <div className={styles.postCell}>
                <p className={styles.postTitle}>{post.title}</p>
              </div>
              <div className={styles.postCell}>
                <span className={`${styles.postStatus} ${post.status === 'published' ? styles.statusPublished : styles.statusDraft}`}>
                  {post.status}
                </span>
              </div>
              <div className={`${styles.postCell} ${styles.postActions}`}>
                {post.status === 'draft' ? (
                  <>
                    <button onClick={() => handlePublish(post.id)} className={styles.publishButton} title="Publish Post">
                      <Send size={16} /> <span className="ml-2">Post</span>
                    </button>
                    <Link to={`/edit-post/${post.id}`} className={styles.actionButton} title="Edit Post"><Edit2 /></Link>
                    <button onClick={() => handleDelete(post.id)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Delete Post"><Trash2 /></button>
                  </>
                ) : (
                  <>
                    <div className={styles.postStats}>
                      <span className={styles.statItem} title="Views"><Eye /> {post.viewCount || 0}</span>
                      <span className={styles.statItem} title="Likes"><Heart /> {post.likes?.length || 0}</span>
                      <span className={styles.statItem} title="Comments"><MessageSquare /> {commentCounts[post.id] || 0}</span>
                    </div>
                    <button onClick={() => handleDelete(post.id)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Delete Post"><Trash2 /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
