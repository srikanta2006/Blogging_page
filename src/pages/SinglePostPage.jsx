// src/pages/SinglePostPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, collection, query, where, onSnapshot, limit, increment, updateDoc } from 'firebase/firestore';
import CommentSection from '../components/CommentSection';
import LikeButton from '../components/LikeButton';
import BookmarkButton from '../components/BookmarkButton';
import FollowButton from '../components/FollowButton';
import ShareButton from '../components/ShareButton';
import styles from './SinglePostPage.module.css';

function SinglePostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [morePosts, setMorePosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const postRef = doc(db, 'posts', postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const postData = { id: postSnap.id, ...postSnap.data() };
        setPost(postData);
        
        const viewed = sessionStorage.getItem(postId);
        if (!viewed) {
          await updateDoc(postRef, { viewCount: increment(1) });
          sessionStorage.setItem(postId, 'true');
        }

        const authorRef = doc(db, 'users', postData.authorId);
        const authorSnap = await getDoc(authorRef);
        if (authorSnap.exists()) {
          setAuthor(authorSnap.data());
        }

        const morePostsQuery = query(
          collection(db, 'posts'),
          where('authorId', '==', postData.authorId),
          where('status', '==', 'published'),
          limit(4)
        );
        onSnapshot(morePostsQuery, (snapshot) => {
          const otherPosts = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(p => p.id !== postId);
          setMorePosts(otherPosts.slice(0, 3));
        });

      } else {
        console.log("Post not found!");
      }
      setLoading(false);
    };

    fetchAllData();
  }, [postId]);

  if (loading) return <div className="text-center py-20">Loading Article...</div>;
  if (!post) return <div className="text-center py-20">Post not found.</div>;

  return (
    <div className={styles.pageLayout}>
      <article className={styles.mainArticle}>
        <header className={styles.header}>
          <p className={styles.category}>{post.categories?.[0] || 'Uncategorized'}</p>
          <h1 className={styles.title}>{post.title}</h1>
        </header>

        <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.content }} />

        <footer className={styles.actionsFooter}>
          <LikeButton postId={post.id} />
          <BookmarkButton postId={post.id} />
          <ShareButton title={post.title} text={`Check out this article by ${author?.username}: "${post.title}"`} />
        </footer>

        <hr className={styles.divider} />

        <CommentSection 
          postId={post.id} 
          postAuthorId={post.authorId} 
          postTitle={post.title} 
        />
      </article>

      <aside className={styles.sidebar}>
        {author && (
          <div className={styles.sidebarCard}>
            <div className={styles.authorSpotlight}>
              <Link to={`/profile/${post.authorId}`}>
                <img src={author.profilePictureURL || `https://i.pravatar.cc/80?u=${post.authorId}`} alt={author.username} className={styles.authorImage} />
              </Link>
              <Link to={`/profile/${post.authorId}`}><h3 className={styles.authorName}>{author.username}</h3></Link>
              <p className={styles.authorBio}>{author.bio?.substring(0, 100) || ''}{author.bio?.length > 100 ? '...' : ''}</p>
              <FollowButton profileUserId={post.authorId} />
            </div>
          </div>
        )}
        {morePosts.length > 0 && (
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>More from {author?.username}</h3>
            <div className={styles.morePostsList}>
              {morePosts.map(p => (
                <Link key={p.id} to={`/post/${p.id}`} className={styles.morePostsItem}>
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default SinglePostPage;
