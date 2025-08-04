// src/components/NotificationPanel.jsx

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, doc, writeBatch } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from '../hooks/useClickOutside';
import styles from './NotificationPanel.module.css';
import { Bell, Heart, MessageSquare } from 'lucide-react';

function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const panelRef = useRef();

  useClickOutside(panelRef, () => setIsOpen(false));

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'users', currentUser.uid, 'notifications'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [currentUser]);

  const handleMarkAsRead = async () => {
    if (!currentUser) return;
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length === 0) return;

    const batch = writeBatch(db);
    unreadNotifications.forEach(note => {
      const noteRef = doc(db, 'users', currentUser.uid, 'notifications', note.id);
      batch.update(noteRef, { read: true });
    });
    await batch.commit();
  };

  const handleTogglePanel = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    // If we are opening the panel, mark notifications as read
    if (newIsOpen) {
      handleMarkAsRead();
    }
  };

  const handleNotificationClick = (postId) => {
    setIsOpen(false);
    navigate(`/post/${postId}`);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      <button onClick={handleTogglePanel} className={styles.panelButton}>
        <Bell size={24} />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className={styles.panelContainer}>
          <header className={styles.header}>Notifications</header>
          <div className={styles.notificationList}>
            {notifications.length > 0 ? (
              notifications.map(note => (
                <div key={note.id} onClick={() => handleNotificationClick(note.postId)} className={styles.notificationItem}>
                  <div className={styles.icon}>
                    {note.type === 'like' ? <Heart size={20} /> : <MessageSquare size={20} />}
                  </div>
                  <div>
                     <p className={styles.text}><strong>{note.fromUser}</strong> {note.type === 'like' ? 'liked your post:' : 'commented on:'} <strong>"{note.postTitle}"</strong></p>
                    <p className={styles.timestamp}>{new Date(note.createdAt?.toDate()).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>You have no new notifications.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPanel;
