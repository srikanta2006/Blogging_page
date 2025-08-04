// src/pages/UserSettingsPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updateProfile, updatePassword } from 'firebase/auth';
import { db } from '../firebase/config';
import { User, Settings, Bell, Shield, Paintbrush, Save, Camera, Moon, Sun } from 'lucide-react';

const UserSettingsPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  // All state declarations (profileData, accountData, etc.) remain the same...
  const [profileData, setProfileData] = useState({ username: '', bio: '', location: '', website: '', profilePictureURL: '' });
  const [accountData, setAccountData] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [notifications, setNotifications] = useState({ emailOnComment: true, emailOnLike: true, emailOnFollow: true, weeklyDigest: false });
  const [privacy, setPrivacy] = useState({ profileVisibility: 'public', showEmailOnProfile: false });

  useEffect(() => {
    if (currentUser) loadUserData();
  }, [currentUser]);

  const loadUserData = async () => {
    // ... loadUserData function is the same
    if (!currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfileData({
          username: userData.username || currentUser.displayName || '',
          bio: userData.bio || '',
          location: userData.location || '',
          website: userData.website || '',
          profilePictureURL: userData.profilePictureURL || currentUser.photoURL || ''
        });
        setNotifications(prev => ({ ...prev, ...userData.notifications }));
        setPrivacy(prev => ({ ...prev, ...userData.privacy }));
      }
      setAccountData(prev => ({ ...prev, email: currentUser.email }));
    } catch (error) { console.error('Error loading user data:', error); }
  };

  // All handler functions (handleProfileUpdate, etc.) remain the same...
  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { username: profileData.username, bio: profileData.bio, location: profileData.location, website: profileData.website, profilePictureURL: profileData.profilePictureURL });
      await updateProfile(currentUser, { displayName: profileData.username, photoURL: profileData.profilePictureURL });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) { setMessage({ type: 'error', text: 'Error updating profile: ' + error.message }); }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };
  const handlePasswordUpdate = async () => {
    if (accountData.newPassword !== accountData.confirmPassword) { setMessage({ type: 'error', text: 'New passwords do not match' }); return; }
    setLoading(true);
    try {
      await updatePassword(currentUser, accountData.newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setAccountData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
    } catch (error) { setMessage({ type: 'error', text: 'Error updating password. Please log out and back in to try again.' }); }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };
  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { notifications });
      setMessage({ type: 'success', text: 'Notification preferences updated!' });
    } catch (error) { setMessage({ type: 'error', text: 'Error updating notifications: ' + error.message }); }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };
  const handlePrivacyUpdate = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { privacy });
      setMessage({ type: 'success', text: 'Privacy settings updated!' });
    } catch (error) { setMessage({ type: 'error', text: 'Error updating privacy settings: ' + error.message }); }
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };
  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Paintbrush }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64">
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* ... Profile fields ... */}
                  <button onClick={handleProfileUpdate} disabled={loading} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"><Save size={16} />{loading ? 'Saving...' : 'Save Changes'}</button>
                </div>
              )}

              {/* Account Tab */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  {/* ... Account fields ... */}
                  <button onClick={handlePasswordUpdate} disabled={loading || !accountData.newPassword} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"><Save size={16} />{loading ? 'Updating...' : 'Update Password'}</button>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {/* ... Notification toggles ... */}
                  <button onClick={handleNotificationUpdate} disabled={loading} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"><Save size={16} />{loading ? 'Saving...' : 'Save Preferences'}</button>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  {/* ... Privacy toggles ... */}
                  <button onClick={handlePrivacyUpdate} disabled={loading} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"><Save size={16} />{loading ? 'Saving...' : 'Save Settings'}</button>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      {darkMode ? <Moon className="text-blue-600" size={24} /> : <Sun className="text-yellow-500" size={24} />}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark themes</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
