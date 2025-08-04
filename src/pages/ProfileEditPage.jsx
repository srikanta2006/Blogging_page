// src/pages/ProfileEditPage.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { updateProfile } from 'firebase/auth';
import styles from './ProfileEditPage.module.css';
import { Camera, Save } from 'lucide-react';

function ProfileEditPage() {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    bio: '',
    dateOfBirth: '',
    location: '',
    profilePictureURL: '',
    coverPhotoURL: ''
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (currentUser) {
      const loadUserData = async () => {
        const userRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            username: data.username || currentUser.displayName || '',
            bio: data.bio || '',
            dateOfBirth: data.dateOfBirth || '',
            location: data.location || '',
            profilePictureURL: data.profilePictureURL || currentUser.photoURL || '',
            coverPhotoURL: data.coverPhotoURL || ''
          });
        }
        setLoading(false);
      };
      loadUserData();
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSaveChanges = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, profileData);
      
      // Also update the auth profile
      await updateProfile(currentUser, {
        displayName: profileData.username,
        photoURL: profileData.profilePictureURL
      });

      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Failed to update profile.");
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-20">Loading Profile...</div>;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Edit Your Profile</h1>
      </header>
      <div className={styles.formContainer}>
        <div className={styles.coverPhoto}>
          {profileData.coverPhotoURL && <img src={profileData.coverPhotoURL} alt="Cover" />}
          <button className={styles.photoButton}><Camera size={16} /> Edit Cover</button>
        </div>
        
        <div className={styles.profilePictureContainer}>
          <div className={styles.profilePicture}>
            {profileData.profilePictureURL && <img src={profileData.profilePictureURL} alt="Profile" className={styles.profilePicture} />}
            <button className={styles.photoButton}><Camera size={16} /></button>
          </div>
        </div>

        <div className={styles.formFields}>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Name</label>
            <input name="username" value={profileData.username} onChange={handleInputChange} className={styles.input} />
          </div>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Bio</label>
            <textarea name="bio" value={profileData.bio} onChange={handleInputChange} className={styles.textarea} rows="4"></textarea>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Date of Birth</label>
            <input name="dateOfBirth" type="date" value={profileData.dateOfBirth} onChange={handleInputChange} className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Location</label>
            <input name="location" value={profileData.location} onChange={handleInputChange} className={styles.input} />
          </div>
          {/* Note: File uploads require Firebase Storage. For now, these are text inputs. */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Profile Picture URL</label>
            <input name="profilePictureURL" value={profileData.profilePictureURL} onChange={handleInputChange} className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Cover Photo URL</label>
            <input name="coverPhotoURL" value={profileData.coverPhotoURL} onChange={handleInputChange} className={styles.input} />
          </div>
        </div>

        <div className={styles.formFooter}>
          <button onClick={handleSaveChanges} disabled={loading} className={styles.saveButton}>
            <Save size={16} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditPage;
