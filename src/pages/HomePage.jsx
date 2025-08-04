// src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './HomePage.module.css';
import LikeButton from '../components/LikeButton';
import BookmarkButton from '../components/BookmarkButton';
import { TrendingUp } from 'lucide-react';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [topPost, setTopPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState('global');
  const { currentUser } = useAuth();

  // THE FIX: We now use a single, unified useEffect for all data fetching.
  useEffect(() => {
    setLoading(true);
    let unsubscribe;

    const fetchFeed = async () => {
      let postsQuery;
      if (feedType === 'following' && currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        const followingList = userDocSnap.data()?.following || [];
        if (followingList.length > 0) {
          postsQuery = query(collection(db, 'posts'), where('authorId', 'in', followingList), where('status', '==', 'published'));
        } else {
          setPosts([]);
          setTopPost(null);
          setLoading(false);
          return;
        }
      } else {
        // Global feed query
        postsQuery = query(collection(db, 'posts'), where('status', '==', 'published'));
      }

      unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        let fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort by date for the main feed
        fetchedPosts.sort((a, b) => (b.publishedAt?.toDate() || 0) - (a.publishedAt?.toDate() || 0));
        setPosts(fetchedPosts);

        // If it's the global feed, find the top post from the same data
        if (feedType === 'global' && fetchedPosts.length > 0) {
          const sortedByViews = [...fetchedPosts].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
          setTopPost(sortedByViews[0]);
        } else {
          setTopPost(null);
        }
        
        setLoading(false);
      });
    };

    fetchFeed();
    return () => { if (unsubscribe) unsubscribe(); };
  }, [feedType, currentUser]);

  const createSnippet = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return (
    <div className={styles.pageLayout}>
      <main className="col-span-full">
        <div className={styles.tabContainer}>
          <div className={styles.tabList}>
            <button onClick={() => setFeedType('global')} className={`${styles.tab} ${feedType === 'global' ? styles.tabActive : ''}`}>Global</button>
            <button onClick={() => setFeedType('following')} disabled={!currentUser} className={`${styles.tab} ${feedType === 'following' ? styles.tabActive : ''}`}>Following</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading Feed...</div>
        ) : (
          <div className={styles.mainFeed}>
            {posts.map(post => (
              <article key={post.id} className={styles.postItem}>
                <header className={styles.postHeader}>
                  <Link to={`/post/${post.id}`} className={styles.postTitle}>
                    <h2>{post.title}</h2>
                  </Link>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorDetails}>
                      <Link to={`/profile/${post.authorId}`} className={styles.authorName}>{post.authorUsername}</Link>
                      <p className={styles.postDate}>{post.publishedAt?.toDate().toLocaleDateString()}</p>
                    </div>
                    <Link to={`/profile/${post.authorId}`}>
                      <img src={post.authorProfilePic || `https://i.pravatar.cc/40?u=${post.authorId}`} alt={post.authorUsername} className={styles.authorImage} />
                    </Link>
                  </div>
                </header>
                <p className={styles.postSnippet}>{createSnippet(post.content).substring(0, 250)}...</p>
                <footer className={styles.postFooter}>
                  <Link to={`/post/${post.id}`} className={styles.readMoreLink}>Read More &rarr;</Link>
                  <div className={styles.actions}><LikeButton postId={post.id} /><BookmarkButton postId={post.id} /></div>
                </footer>
              </article>
            ))}
          </div>
        )}
      </main>

      {feedType === 'global' && topPost && (
        <aside className={`${styles.sidebar} hidden lg:block`}>
          <div className={styles.trendingPostContainer}>
            <header className={styles.sectionHeader}><TrendingUp size={24} /><h2 className={styles.sectionTitle}>Trending Post</h2></header>
            <div className={styles.trendingPostContent}>
              <header className={styles.postHeader}>
                <Link to={`/profile/${topPost.authorId}`}><img src={topPost.authorProfilePic || `https://i.pravatar.cc/48?u=${topPost.authorId}`} alt={topPost.authorUsername} className={styles.authorImage} /></Link>
                <div>
                  <Link to={`/profile/${topPost.authorId}`}><p className={styles.authorName}>{topPost.authorUsername}</p></Link>
                  <p className={styles.postDate}>{topPost.publishedAt?.toDate().toLocaleDateString()}</p>
                </div>
              </header>
              <h1 className={styles.postTitle}>{topPost.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: topPost.content }} />
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}

export default HomePage;
