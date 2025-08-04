// src/pages/CategoryPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function CategoryPage() {
  const { categoryName } = useParams(); // Get category name from URL
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query to get posts where the 'categories' array contains the categoryName
    const postsQuery = query(
      collection(db, 'posts'),
      where('categories', 'array-contains', categoryName)
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const categoryPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(categoryPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryName]);

  if (loading) {
    return <div>Loading posts for "{categoryName}"...</div>;
  }

  return (
    <div>
      <h1>Category: {categoryName}</h1>
      <div className="posts-feed">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h2>{post.title}</h2>
              <p>by {post.authorUsername}</p>
              <Link to={`/post/${post.id}`}>Read More</Link>
            </div>
          ))
        ) : (
          <p>No posts found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
