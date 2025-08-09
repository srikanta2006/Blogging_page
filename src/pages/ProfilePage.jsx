// src/pages/ProfilePage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import FollowButton from '../components/FollowButton';
import ShareButton from '../components/ShareButton';
import Avatar from '../components/Avatar'; // 1. Import the new component
import styles from './ProfilePage.module.css';
import { Edit2, MapPin } from 'lucide-react';

function ProfilePage() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser && currentUser.uid === userId;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setProfile(userDocSnap.data());
      }
      
      const postsQuery = query(collection(db, 'posts'), where('authorId', '==', userId), where('status', '==', 'published'));
      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });
      return () => unsubscribe();
    };
    fetchProfileData();
  }, [userId]);

  if (loading) return <div className="text-center py-20">Loading Profile...</div>;
  if (!profile) return <div className="text-center py-20">User not found.</div>;

  return (
    <div>
      <header className={styles.profileHeader}>
        <div className={styles.coverPhoto}>
          {profile.coverPhotoURL && <img src={profile.coverPhotoURL} alt="Cover" />}
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.mainInfo}>
            {/* 2. Replace the img tag with the Avatar component */}
            <Avatar 
              src={profile.profilePictureURL}
              name={profile.username}
              className={styles.profilePicture}
            />
            <div className="flex-grow" />
            <div className={styles.nameAndActions}>
              {isOwnProfile ? (
                <Link to="/edit-profile" className={styles.editButton}>
                  <Edit2 size={16} /> Edit Profile
                </Link>
              ) : (
                <FollowButton profileUserId={userId} />
              )}
              <ShareButton title={profile.username} text={`Check out ${profile.username}'s profile on Blogzilla!`} />
            </div>
          </div>
        </div>
        <div className="px-10 pb-6">
           <h1 className={styles.username}>{profile.username}</h1>
           {profile.location && (
              <p className="flex items-center gap-2 mt-2 text-gray-500">
                <MapPin size={16} /> {profile.location}
              </p>
            )}
           {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}><strong>{posts.length}</strong> Posts</div>
          <div className={styles.statItem}><strong>{profile.followers?.length || 0}</strong> Followers</div>
          <div className={styles.statItem}><strong>{profile.following?.length || 0}</strong> Following</div>
        </div>
      </header>

      <section>
        <h2 className={styles.postsHeader}>Published Posts</h2>
        <div className={styles.postGrid}>
          {posts.map(post => (
            <Link to={`/post/${post.id}`} key={post.id} className={styles.card}>
              <div>
                <h3 className={styles.cardTitle}>{post.title}</h3>
              </div>
              <p className={styles.cardDate}>
                {post.publishedAt?.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
