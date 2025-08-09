// src/components/Navbar.jsx
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClickOutside } from '../hooks/useClickOutside';
import NotificationPanel from './NotificationPanel';
import Avatar from './Avatar'; // Import the new component
import styles from './Navbar.module.css';
import { Menu, X, Home, LayoutDashboard, Bookmark, LogOut } from 'lucide-react';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftSection}>
            <Link to="/" className={styles.logo}>Burst</Link>
          </div>
          <div className={styles.rightSection}>
            {currentUser ? (
              <>
                <Link to="/create-post" className={`${styles.button} hidden md:inline-flex`}>Create Post</Link>
                <NotificationPanel />
                <Link to={`/profile/${currentUser.uid}`} title="View Profile">
                  {/* Replace the img tag with the Avatar component */}
                  <Avatar
                    src={currentUser.photoURL}
                    name={currentUser.displayName}
                    className={styles.avatar}
                  />
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className={styles.hamburgerButton}>
                    {isDropdownOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                  <div className={`${styles.dropdown} ${isDropdownOpen ? styles.open : ''}`}>
                    <nav className={styles.dropdownMenu}>
                      <Link to="/" className={styles.dropdownLink} onClick={() => setIsDropdownOpen(false)}><Home size={16} /> Home</Link>
                      <Link to="/dashboard" className={styles.dropdownLink} onClick={() => setIsDropdownOpen(false)}><LayoutDashboard size={16} /> Dashboard</Link>
                      <Link to="/reading-list" className={styles.dropdownLink} onClick={() => setIsDropdownOpen(false)}><Bookmark size={16} /> Reading List</Link>
                      <hr className="my-1 border-gray-200" />
                      <button onClick={handleLogout} className={`${styles.dropdownButton} ${styles.logoutButton}`}><LogOut size={16} /> Logout</button>
                    </nav>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.link}>Login</Link>
                <Link to="/signup" className={styles.button}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;