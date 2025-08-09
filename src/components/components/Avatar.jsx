// src/components/Avatar.jsx

import { useMemo } from 'react';
import styles from './Avatar.module.css';

// Helper function to generate a consistent color from a string (like a user ID or name)
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

  return (
    <div className={`${styles.avatarWrapper} ${className}`}>
      {src ? (
        <img src={src} alt={name || 'Avatar'} className={styles.avatarImage} />
      ) : (
        <div className={styles.initials} style={{ backgroundColor: avatarColor }}>
          <span>{initial}</span>
        </div>
      )}
    </div>
  );
}

export default Avatar;
