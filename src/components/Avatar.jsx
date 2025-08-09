// src/components/Avatar.jsx

import { useMemo } from 'react';
import styles from './Avatar.module.css';

const generateColor = (str) => {
  if (!str) return '#cccccc';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

function Avatar({ src, name, className }) {
  const initial = name ? name.charAt(0) : '';
  const avatarColor = useMemo(() => generateColor(name || ''), [name]);

  // This logic checks if the className passed to the component includes the unique
  // class for the large profile picture, and applies the larger font size if it does.
  const isLarge = className && className.includes('profilePicture');

  return (
    <div className={`${styles.avatarWrapper} ${className}`}>
      {src ? (
        <img src={src} alt={name || 'Avatar'} className={styles.avatarImage} />
      ) : (
        <div 
          className={`${styles.initials} ${isLarge ? styles.largeInitial : ''}`} 
          style={{ backgroundColor: avatarColor }}
        >
          <span>{initial}</span>
        </div>
      )}
    </div>
  );
}

export default Avatar;
