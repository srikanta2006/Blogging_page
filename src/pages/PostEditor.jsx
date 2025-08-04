
// src/pages/PostEditor.jsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Editor } from '@tinymce/tinymce-react';
import styles from './PostEditor.module.css';

function PostEditor() {
  const { postId } = useParams();
  const isEditing = Boolean(postId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  useEffect(() => {
    if (isEditing && currentUser) {
      const fetchPostData = async () => {
        const postRef = doc(db, 'posts', postId);
        try {
          const postSnap = await getDoc(postRef);
          if (postSnap.exists()) {
            const postData = postSnap.data();
            if (postData.authorId === currentUser.uid) {
              setTitle(postData.title);
              setContent(postData.content);
              setCategories(postData.categories ? postData.categories.join(', ') : '');
            } else {
              setError("Permission Denied: You are not the author of this post.");
            }
          } else {
            setError("This post does not exist.");
          }
        } catch (err) {
          setError("Failed to load post data.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchPostData();
    }
  }, [postId, isEditing, currentUser]);

  const handleSave = async (status) => {
    setError(null);
    if (!currentUser) return;
    if (!title.trim()) { setError('Post title cannot be empty.'); return; }
    if (editorRef.current) {
      const currentContent = editorRef.current.getContent();
      const categoriesArray = categories.split(',').map(cat => cat.trim()).filter(cat => cat !== '');
      
      // THE FIX IS HERE: We now add the author's profile picture URL to the post data.
      const postData = {
        title, 
        content: currentContent, 
        categories: categoriesArray, 
        status,
        authorId: currentUser.uid, 
        authorUsername: currentUser.displayName || currentUser.email,
        authorProfilePic: currentUser.photoURL || '', // This line is new
        lastUpdatedAt: serverTimestamp(),
      };

      try {
        if (isEditing) {
          const postRef = doc(db, 'posts', postId);
          const originalPost = await getDoc(postRef);
          if (status === 'published' && !originalPost.data().publishedAt) {
            postData.publishedAt = serverTimestamp();
          }
          await updateDoc(postRef, postData);
        } else {
          postData.createdAt = serverTimestamp();
          postData.publishedAt = status === 'published' ? serverTimestamp() : null;
          postData.likes = [];
          postData.viewCount = 0;
          await addDoc(collection(db, 'posts'), postData);
        }
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to save post.'); console.error(err);
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-lg font-medium text-gray-600">Loading Editor...</div>;
  if (error && isEditing) return <div className="text-center py-20 text-lg font-medium text-red-600">{error}</div>;

  return (
    <div className={styles.editorLayout}>
      <main className={styles.mainContent}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title..."
          className={styles.titleInput}
        />
        <div className={styles.editorContainer}>
          <Editor
            apiKey="i0s7ozptu5vyr0pzbdu339domhzm9zvyspbfgax3bj8ja9v5"
            onInit={(evt, editor) => editorRef.current = editor}
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
            init={{
              height: 'calc(100vh - 250px)',
              menubar: false,
              plugins: 'autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
              toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
              content_style: 'body { font-family:Inter,sans-serif; font-size:16px; line-height: 1.6; padding: 2rem; }',
            }}
          />
        </div>
      </main>
      <aside className={styles.sidebar}>
         <div className={styles.settingsCard}>
          <h2 className={styles.settingsHeader}>{isEditing ? 'Update Post' : 'Publishing'}</h2>
          <div className={styles.inputGroup}>
            <label htmlFor="categories" className={styles.label}>Categories</label>
            <input
              id="categories"
              type="text"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
              placeholder="e.g., Tech, Lifestyle"
              className={styles.input}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className={styles.actions}>
            <button onClick={() => handleSave('published')} className={styles.publishButton}>
              {isEditing ? 'Update & Publish' : 'Publish'}
            </button>
            <button onClick={() => handleSave('draft')} className={styles.draftButton}>
              {isEditing ? 'Save Changes' : 'Save Draft'}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default PostEditor;
