// src/components/ShareButton.jsx
import styles from './ShareButton.module.css';
import { Share2 } from 'lucide-react';

function ShareButton({ title, text, url }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url || window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(url || window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <button onClick={handleShare} className={styles.shareButton}>
      <Share2 size={16} /> Share
    </button>
  );
}

export default ShareButton;
